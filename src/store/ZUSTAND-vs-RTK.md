# zustand vs Redux Toolkit 对比笔记

> 对照项目：`reactUmi3-17/src/redux-toolkit`（RTK 6 个 slice）
> 本目录：用 zustand 5 实现完全相同的 state 形状与操作，逐文件一一对应。

## 文件对应关系

| 业务 | RTK slice | zustand store | 对比重点 |
|------|-----------|---------------|----------|
| 计数 | countSlice | useCountStore | 最简结构 |
| 通知 | notificationSlice | useNotificationStore | 数组 + prepare 模式 |
| 用户 | userSlice | useUserStore | **异步请求**（重点） |
| 设置 | settingSlice | useSettingStore | Record 动态 key |
| 购物车 | cartSlice | useCartStore | 数组增删改 + 默认值 |
| 待办 | todoSlice | useTodoStore | 嵌套对象 state |

## 核心差异

| 维度 | Redux Toolkit | zustand |
|------|---------------|---------|
| store 数量 | 单一全局 store（configureStore 合并所有 slice） | 多个独立 store（每个 create 一个） |
| 不可变更新 | 内置 immer，可直接 `state.x = y` | 默认手动展开（`{...state.x}`），可选 immer 中间件 |
| action | createSlice 自动生成 type + action creator | 就是 store 里的普通函数，直接调用 |
| dispatch | 必须 `dispatch(action())` | 直接 `store.foo()`，无 dispatch |
| 异步 | createAsyncThunk + extraReducers（pending/fulfilled/rejected） | 普通 async 函数里手动 set 三个阶段 |
| 组件读取 | `useSelector((s: RootState) => s.x)` | `useStore((s) => s.x)`（自带选择器） |
| Provider | 必须 `<Provider store={store}>` 包裹 | 无需 Provider，import 即用 |
| 类型 | RootState/AppDispatch 需从 store 推导 | 每个 store 自己的 interface，独立 |
| 样板量 | 多（type/creator/reducer/extraReducers） | 少（state + 函数写一起） |

## 异步对比（最直观的差异）

RTK 需要 createAsyncThunk + extraReducers 三段式：

```ts
export const login = createAsyncThunk('user/login', async (name, { rejectWithValue }) => {
  try { return await fakeLoginApi(name); }
  catch (e) { return rejectWithValue(e.message); }
});
// extraReducers 里再分别处理 pending / fulfilled / rejected
```

zustand 就是一个 async 方法，自己控制三个阶段：

```ts
login: async (username) => {
  set({ loading: true, error: null });        // pending
  try {
    const user = await fakeLoginApi(username);
    set({ loading: false, info: user });       // fulfilled
  } catch (err) {
    set({ loading: false, error: (err as Error).message }); // rejected
  }
},
```

## 订阅 → 触发渲染：两者如何控制过度渲染

> 一句话总结：**RTK 是"全员喊话、各自捂耳朵"——所有过滤都在订阅端（选择器 + 相等性比较 + reselect）；zustand 多了一层"分组喊话"——靠拆 store 在通知阶段就缩小范围，剩下的同样靠选择器 + `useShallow` 过滤。**

统一心智模型——任何组件重渲染都要走完这条链：

```
状态变化 → 通知订阅者 → 跑各自 selector → 比较新旧返回值 → 不等才渲染
            ①通知范围        ②取值            ③相等性比较       ④渲染
```

两者差异集中在 ①通知范围 和 ③相等性比较：

| | react-redux (RTK) | zustand |
|---|---|---|
| store 数量 | 单一全局 store | 多个独立 store（模块级单例） |
| ①通知范围 | 每次 dispatch 通知**所有** useSelector | 只通知**该 store** 的订阅者 |
| 控制渲染的"第一道闸" | 无，全靠订阅端选择器 | **拆 store**，从源头缩小通知面 |
| ③默认相等性 | `Object.is`（引用） | `Object.is`（引用） |
| 选对象防无限渲染 | `useSelector(fn, shallowEqual)` | `useShallow(fn)` |
| 派生数据记忆化 | `reselect` / `createSelector` | 选择器内计算 或 `subscribeWithSelector` |

- **RTK**：单 store，1 次 dispatch 会让全 app 每个 `useSelector` 都跑一遍 selector，多数因"返回值没变"而未真正渲染。过度渲染全压在第②③步：选窄 + 选对象配 `shallowEqual` + 派生数据用 `reselect` + 子组件 `React.memo`。
- **zustand**：拆 store = 在第①步就按 store 边界切断通知扇出（改购物车不会惊动只用计数器的组件），这是 RTK 单 store 做不到的；其余同样靠逐个选择器 + `useShallow` 在第②③步过滤。

> 注意：若把不相关状态塞进**同一个** zustand store，第①步的隔离优势就消失了，退化成和 RTK 单 store 一样——此时只能靠选择器兜底。

## 几点说明

1. RTK 的 slice state 可以直接是数组（`initialState: [] as T[]`）；zustand 的 store 必须是对象，所以 cart/notification/todo 用 `{ list: [] }` 包了一层。
2. zustand 没有 immer，所以数组/Record 更新都用展开运算符手动保持不可变。若想要 RTK 那样的 `state.x = y` 写法，可引入 `zustand/middleware/immer`。
3. zustand 默认无 Redux DevTools，可通过 `zustand/middleware` 的 `devtools` 中间件接入。
4. 持久化：RTK 需要 redux-persist；zustand 自带 `persist` 中间件。

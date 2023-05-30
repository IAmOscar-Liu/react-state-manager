import { InputHTMLAttributes } from "react";
import { createStateHook } from "./SimpleStateManager";

type Profile = { name: string; email: string };

const useCounter = createStateHook(0);
const useProfile = createStateHook<Profile>({ name: "John", email: "aaa@gmail.com" });

interface CustomInputProps<T> extends InputHTMLAttributes<HTMLInputElement> {
  dataKey: keyof T;
}

const CustomInput = ({ dataKey, type, ...rest }: CustomInputProps<Profile>) => {
  const [profile, setProfile] = useProfile();

  return (
    <>
      <label>{dataKey}</label>
      <input
        type={type}
        value={profile[dataKey]}
        onChange={(e) =>
          setProfile((prev) => ({ ...prev, [dataKey]: e.target.value }))
        }
        {...rest}
      />
    </>
  );
};

const Counter = () => {
  const [count, setCount] = useCounter();

  return (
    <>
      <div>Count = {count}</div>
      <button onClick={() => setCount(count + 1)}>Add One</button>
    </>
  );
};

const Info = () => {
  return (
    <div>
      <Counter />
      <div>
        <CustomInput dataKey="name" type="text" />
        <CustomInput dataKey="email" type="email" />
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <Info />
      <Info />
      <Info />
      <Info />
      <Info />
    </div>
  );
}

export default App;

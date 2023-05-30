import { useState, useEffect } from "react";

const createSubscribable = <MessageType>() => {
  const subscribers: Set<(msg: MessageType) => void> = new Set();

  return {
    subscribe: (updator: (msg: MessageType) => void): (() => void) => {
      subscribers.add(updator);
      return () => {
        subscribers.delete(updator);
      };
    },

    publish: (msg: MessageType): void => {
      subscribers.forEach((updator) => updator(msg));
    },
  };
};

type Updator<T> = T | ((prev: T) => T);

export const createStateHook = <DataType>(
  initialValue: DataType
): (() => [DataType, (updator: Updator<DataType>) => void]) => {
  const subscribers = createSubscribable<DataType>();
  return () => {
    const [value, setValue] = useState<DataType>(initialValue);

    useEffect(() => subscribers.subscribe(setValue), []);

    return [
      value,
      (updator: Updator<DataType>) => {
        if (typeof updator === "function")
          subscribers.publish((updator as any)(value));
        else subscribers.publish(updator);
      },
    ];
  };
};

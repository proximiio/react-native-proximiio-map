export const White90 = 'rgba(255, 255, 255, 0.9)';

export const log = (...args: any[]) => {
  if (__DEV__) {
    console.log(`${new Date().toISOString()} [Proximi.io] ${args}`);
  }
};

export const debug = (..._args: any[]) => {
  if (__DEV__) {
    // console.log(`${new Date().toISOString()} [Proximi.io] ${args}`);
  }
};

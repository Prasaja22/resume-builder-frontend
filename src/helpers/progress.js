import { getCurrentInstance } from 'vue';

export function useProgress() {
  const { appContext } = getCurrentInstance();
  const $Progress = appContext.config.globalProperties.$Progress;

  function startProgress() {
    $Progress.start();
  }

  function finishProgress() {
    $Progress.finish();
  }

  function failProgress() {
    $Progress.fail();
  }

  return { startProgress, finishProgress, failProgress };
}

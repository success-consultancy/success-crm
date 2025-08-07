import { useToastContext } from '@/context/toast-context';

const useToast = () => {
  return useToastContext();
};

export default useToast;

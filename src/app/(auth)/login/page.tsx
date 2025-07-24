import { Metadata } from 'next';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Login | Success Education',
  description:
    'Sign in to your Success Education account to access your dashboard and manage your consultancy services.',
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;

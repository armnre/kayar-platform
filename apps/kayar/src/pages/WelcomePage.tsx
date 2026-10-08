import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Splash from '../components/Splash';

export default function WelcomePage() {
  const navigate = useNavigate();
  const done = useCallback(() => navigate('/home', { replace: true }), [navigate]);
  return <Splash onDone={done} />;
}

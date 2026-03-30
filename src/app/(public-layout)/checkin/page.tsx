'use client';

import { useState } from 'react';
import InitialScreen from './_components/initial-screen';
import NewClientForm from './_components/new-client-form';
import ReturningClientForm from './_components/returning-client-form';
import SuccessScreen from './_components/success-screen';

type View = 'initial' | 'new-client' | 'returning-client' | 'success';

const CheckInKioskPage = () => {
  const [view, setView] = useState<View>('initial');

  if (view === 'new-client') {
    return (
      <NewClientForm
        onBack={() => setView('initial')}
        onSuccess={() => setView('success')}
      />
    );
  }

  if (view === 'returning-client') {
    return (
      <ReturningClientForm
        onBack={() => setView('initial')}
        onNewClient={() => setView('new-client')}
      />
    );
  }

  if (view === 'success') {
    return <SuccessScreen onDone={() => setView('initial')} />;
  }

  return (
    <InitialScreen
      onNewClient={() => setView('new-client')}
      onReturningClient={() => setView('returning-client')}
    />
  );
};

export default CheckInKioskPage;

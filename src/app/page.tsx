import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import axios from 'axios';
import { BASE_URL } from '@/constant/BaseURL';

async function checkAuthStatus() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/auth');
  }

  try {
    const response = await axios.get(`${BASE_URL}/auth/login`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    
    if (response.status === 200) {
      redirect('/dashboard');
    }
  } catch (error) {
    redirect('/auth');
  }
}

export default async function HomePage() {
  await checkAuthStatus();
  return <div></div>;
}
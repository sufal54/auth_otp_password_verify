export interface login_data_type {
  user_name: string;
  email?: string;
  password: string;
}
export interface api_data {
  success: boolean;
  message: string;
  user_data?: {
    user_name: string;
    email: string;
    isVerify: boolean;
  };
}
export interface api_user_data {
  user_name: string;
  email: string;
  isVerify: boolean;
}

export const req_login = async (
  userData: login_data_type
): Promise<boolean> => {
  const data: api_data | null = await fetch(
    `http://localhost/api/user/login/${userData.user_name}/${userData.password}`
  ).then((data) => data.json());
  if (!data || !data?.success) {
    return false;
  }
  return true;
};

export const req_signup = async (
  userData: login_data_type
): Promise<boolean> => {
  const data: api_data | null = await fetch(
    `http://localhost/api/user/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: userData.user_name,
        email: userData.email,
        password: userData.password,
      }),
    }
  ).then((data) => data.json());

  if (!data || !data?.success) {
    return false;
  }
  return true;
};

export const get_user_data = async (): Promise<api_user_data | null> => {
  const data: api_data | null = await fetch(
    `http://localhost/api/user/get_user`
  ).then((data) => data.json());
  if (!data || !data.success || !data?.user_data) {
    return null;
  }
  return data.user_data;
};

export const req_send_email = async (user_name: string): Promise<void> => {
  const data: api_data | null = await fetch(
    `http://localhost/api/user/send_mail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name,
      }),
    }
  ).then((data) => data.json());
  if (!data || !data.success) {
    return;
  }
};

export const verify_email = async (
  user_name: string,
  code: string
): Promise<boolean> => {
  const data: api_data | null = await fetch(
    `http://localhost/api/user/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name,
        code,
      }),
    }
  ).then((data) => data.json());
  if (!data || !data.success) {
    return false;
  }
  return true;
};

export const req_forget_pass = async (email: string): Promise<boolean> => {
  const data: api_data | null = await fetch(
    `http://localhost/api/user/reset_pass_req`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  ).then((data) => data.json());
  if (!data || !data.success) {
    return false;
  }
  return true;
};

export const reset_pass = async (
  password: string,
  token: string
): Promise<boolean> => {
  const data: api_data | null = await fetch(
    `http://localhost/api/user/reset_pass`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token,
      }),
    }
  ).then((data) => data.json());
  if (!data || !data.success) {
    return false;
  }
  return true;
};

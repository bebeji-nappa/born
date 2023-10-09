import { TRPCError } from "@trpc/server";
import { signUp, signIn, signOut } from "../services/auth.service";
import type { signUpParams } from "../services/auth.service";

export const signUpHandler = async ({email, password}: signUpParams) => {
  try {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex = /^[a-zA-Z0-9.?!\/-]{8,24}$/;

    if (!email || !(emailRegex).test(email)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid email',
      });
    }

    if (!password || !(passwordRegex).test(password)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid password',
      });
    }

    const result = await signUp({email, password});
    return {
      status: 'success',
      data: {
        result,
      },
    };
  } catch (err: any) {
    if (err.code === 'P2002') {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Post with that account already exists',
      });
    }
    throw err;
  }
};

export const signInHandler = async ({email, password}: signUpParams) => {
  try {
    const result = await signIn({email, password});
    return {
      status: 'success',
      data: {
        result,
      },
    };
  } catch (err: any) {
    throw err;
  }
};

export const signOutHandler = async () => {
  try {
    await signOut();
    return {
      status: 'success',
      data: {},
    };
  } catch (err: any) {
    throw err;
  }
};

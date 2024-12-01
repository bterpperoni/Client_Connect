declare export module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      email: string;
      name: string;
      token: string;
      //= ...other properties
    };
  }
}


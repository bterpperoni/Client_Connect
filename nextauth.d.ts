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

// module.exports = {
//   // other configurations
//   reactStrictMode: true,
//   async redirects() {
//     return [
//       {
//         source: "/login",
//         destination: "/api/auth/signin",
//         permanent: false,
//       },
//     ];
//   },
// };

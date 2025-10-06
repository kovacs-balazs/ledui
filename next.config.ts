import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  experimental: {
    reactCompiler: true,
  },
//   babel: {
//     plugins: [
//       [
//         "@babel/plugin-react-compiler",
//         // Configuration options for the compiler
//         {
//           // The "target" option tells the compiler which version of React to target.
//           // '18' is the current stable version.
//           target: "18",
//           // "runtime" specifies the JSX runtime. 'automatic' is the modern default.
//           runtime: "automatic",
//         },
//       ],
//     ],
//   }
};

  export default nextConfig;

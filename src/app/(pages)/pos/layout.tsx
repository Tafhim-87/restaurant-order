"use client";

import SidebarLayout from "@/app/components/ui/SideNav";
import "@/app/globals.css";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Provider store={store}>
          <SidebarLayout>{children}</SidebarLayout>
        </Provider>
      </body>
    </html>
  );
}

//  "use client";
// import "@/app/globals.css";
// import { AuthProvider } from '@/app/context/AuthContext';
// import { Provider } from 'react-redux';
// import { store } from '@/app/redux/store';
// import SidebarLayout from "@/app/components/ui/SideNav";


// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>
//         <Provider store={store}>
//           <AuthProvider>
//             <SidebarLayout>{children}</SidebarLayout>
//           </AuthProvider>
//         </Provider>
//       </body>
//     </html>
//   );
// }
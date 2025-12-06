import "@/app/globals.css";

import AuthCarousel from "@/components/auth-carrousel";
import AuthHeader from "@/components/ui/auth-header";

interface Props {
  children: React.ReactElement;
}

export default function AuthLayout({ children }: Props) {
  return (
    <html>
      <body>
        <main
          className="grid h-dvh root"
          style={{
            gridTemplateColumns: "1fr auto",
            background:
              "linear-gradient(rgba(0, 0, 0, 0.75),rgba(0, 0, 0, 0.5)), url('/img/auth-wallpaper.jpg')",
            backgroundSize: "cover",
          }}
        >
          <section className="flex flex-col justify-between px-10 py-4 h-full text-white">
            <AuthHeader />
            <AuthCarousel />
          </section>
          {children}
        </main>
      </body>
    </html>
  );
}

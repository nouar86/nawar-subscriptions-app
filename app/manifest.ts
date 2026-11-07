import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nawar Subscription Manager",
    short_name: "Nawar",
    description: "إدارة وتذكير الاشتراكات باحترافية",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#14b8a6",
    icons: [
      {
        src: "/logo.png", // تأكد أن اللوغو موجود في مجلد public
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

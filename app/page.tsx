import FirstPage from "../components/FirstPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AniPlay - Watch Free Anime Online",
  description: "Discover and watch thousands of anime series and movies for free on AniPlay. Your go-to source for the latest and greatest anime content.",
  openGraph: {
    title: "AniPlay - Watch Free Anime Online",
    description: "Discover and watch thousands of anime series and movies for free on AniPlay. Your go-to source for the latest and greatest anime content.",
    // Optionally, add a specific Open Graph image for the homepage here
    // images: [{ url: '/path/to/homepage-image.jpg' }],
  },
  // You can also add Twitter specific metadata if desired
  // twitter: {
  //   card: "summary_large_image",
  //   title: "AniPlay - Watch Free Anime Online",
  //   description: "Discover and watch thousands of anime series and movies for free on AniPlay.",
  //   images: ['/path/to/homepage-image.jpg'],
  // },
};

export default function Home() {
  return <FirstPage />;
}

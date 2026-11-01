import { Hero, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeHeroProps {
  imageUrl?: string;
}

export default function HomeHero({ imageUrl = '/img/brand/hero.jpg' }: HomeHeroProps) {
  return (
    <Hero
      eyebrow="Radiology, done right"
      title="Clear X-rays, faster answers"
      text="Book your X-ray exam online, track its status from scan to signed report, and pay your invoice in one place. Our radiologists and front-desk team keep every step visible to you."
      actions={
        <>
          <Button to="/dashboard" size="lg">
            Go to my dashboard
          </Button>
          <Button to="/register" variant="ghost" size="lg">
            <Icon name="arrow-right" size={18} />
            Create an account
          </Button>
        </>
      }
      media={
        imageUrl ? (
          <div className="ds-media ds-media-wide">
            <img src={imageUrl} alt="Radiologist reviewing an X-ray image" />
          </div>
        ) : undefined
      }
    />
  );
}
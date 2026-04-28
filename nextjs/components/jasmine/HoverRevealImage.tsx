type HoverRevealImageProps = {
  src: string;
};

export function HoverRevealImage({ src }: HoverRevealImageProps) {
  return (
    <div className="hover-reveal" aria-hidden="true">
      <div className="hover-reveal__inner">
        <div className="hover-reveal__img" style={{ backgroundImage: `url(${src})` }} />
      </div>
    </div>
  );
}


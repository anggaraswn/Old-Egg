import { useEffect, useRef, useState } from 'react';
import styles from '../components/Carousel.module.css';

export type ImageType = { id: number; url: string };

const Carousel: React.FC<{ images?: ImageType[] }> = ({ images }) => {
  if (!images) {
    return null;
  }
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ImageType>();
  const carouselItemsRef = useRef<HTMLDivElement[] | null[]>([]);

  useEffect(() => {
    if (images && images[0]) {
      carouselItemsRef.current = carouselItemsRef.current.slice(
        0,
        images.length,
      );

      setSelectedIndex(0);
      setSelectedImage(images[0]);
    }
  }, [images]);

  const handleSelectedImage = (newIndex: number) => {
    if (images && images.length > 0) {
      setSelectedImage(images[newIndex]);
      setSelectedIndex(newIndex);
      if (carouselItemsRef?.current[newIndex]) {
        carouselItemsRef?.current[newIndex]?.scrollIntoView({
          block: 'end',
          inline: 'center',
          behavior: 'smooth',
        });
      }
    }
  };

  const handleRightClick = () => {
    if (images && images.length > 0) {
      let newIndex = selectedIndex + 1;
      if (newIndex >= images.length) {
        newIndex = 0;
      }
      handleSelectedImage(newIndex);
    }
  };

  const handleLeftClick = () => {
    if (images && images.length > 0) {
      let newIndex = selectedIndex - 1;
      if (newIndex < 0) {
        newIndex = images.length - 1;
      }
      handleSelectedImage(newIndex);
    }
  };

  console.log('in');
  return (
    <div className={styles.container}>
      <button onClick={handleLeftClick} className={styles.text}>
        &lsaquo;
      </button>
      <div
        className={styles.selected}
        style={{ backgroundImage: `url(${selectedImage?.url})` }}
      />
      <button onClick={handleRightClick} className={styles.text}>
        &rsaquo;
      </button>
    </div>
  );
};

export default Carousel;

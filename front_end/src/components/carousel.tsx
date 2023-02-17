import { useEffect, useRef, useState } from 'react';

export type ImageType = { id: number; url: string };

const Carousel: React.FC<{images?: ImageType[]}> = ({images}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ImageType>();
  const carouselItemsRef = useRef<HTMLDivElement[] | null[]>([])

  useEffect(() => {
    // if(ima)

    // if(images && images.length > 0){
    //   let newIndex = selectedIndex - 1;
    //   if(newIndex < 0){
    //     newIndex = (images.length - 1);
    //   }

    // }
  })


  return();
}

export default Carousel;

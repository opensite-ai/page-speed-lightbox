import { renderHook, act } from "@testing-library/react";
import { useGalleryState } from "../hooks/useGalleryState";
import { useLightbox } from "../hooks/useLightbox";

describe("useGalleryState", () => {
  it("should call onSelect with index only", () => {
    const onSelect = jest.fn();
    const items = [
      { id: "1", type: "image" as const, src: "img1.jpg", alt: "Image 1" },
      { id: "2", type: "image" as const, src: "img2.jpg", alt: "Image 2" },
    ];

    const { result } = renderHook(() =>
      useGalleryState({ items, initialIndex: 0, onSelect })
    );

    act(() => {
      result.current.next();
    });

    // ✅ Verify onSelect called with index only
    expect(onSelect).toHaveBeenCalledWith(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("should provide currentItem for accessing full item data", () => {
    const items = [
      { id: "1", type: "image" as const, src: "img1.jpg", alt: "Image 1" },
      { id: "2", type: "image" as const, src: "img2.jpg", alt: "Image 2" },
    ];

    const { result } = renderHook(() =>
      useGalleryState({ items, initialIndex: 0 })
    );

    // ✅ currentItem provides full data for the active item
    expect(result.current.currentItem).toEqual(items[0]);

    act(() => {
      result.current.next();
    });

    expect(result.current.currentItem).toEqual(items[1]);
  });
});

describe("useLightbox", () => {
  it("should compose gallery and lightbox state correctly", () => {
    const items = [
      { id: "1", type: "image" as const, src: "img1.jpg", alt: "Image 1" },
    ];
    const onSelect = jest.fn();
    const onOpen = jest.fn();

    const { result } = renderHook(() =>
      useLightbox({
        items,
        onSelect,
        onOpen,
      })
    );

    // ✅ Initial state
    expect(result.current.isOpen).toBe(false);
    expect(result.current.currentItem).toEqual(items[0]);

    // ✅ Open lightbox
    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
    expect(onOpen).toHaveBeenCalled();
  });
});

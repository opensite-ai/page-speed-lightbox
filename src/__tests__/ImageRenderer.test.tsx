import React from "react";
import { render, screen } from "@testing-library/react";
import { ImageRenderer } from "../renderers/ImageRenderer";
import type { LightboxItem, LightboxOptixFlowConfig } from "../types";

const imgInstances: any[] = [];

jest.mock("@page-speed/img", () => ({
	  Img: (props: any) => {
	    imgInstances.push(props);
	    return <div data-testid="img" />;
	  },
}));

describe("ImageRenderer", () => {
	  beforeEach(() => {
	    imgInstances.length = 0;
	  });

	  it("renders nothing when src is missing", () => {
	    const item: LightboxItem = {
	      id: "1",
	      type: "image",
	    };

	    const { container } = render(
	      <ImageRenderer item={item} layout="horizontal" />
	    );

	    expect(container.firstChild).toBeNull();
	    expect(imgInstances).toHaveLength(0);
	  });

	  it("passes src, alt and mapped optixFlowConfig to Img", () => {
	    const item: LightboxItem = {
	      id: "1",
	      type: "image",
	      src: "/img.jpg",
	      alt: "Example image",
	    };

	    const optixFlowConfig: LightboxOptixFlowConfig = {
	      apiKey: "test-key",
	      compression: 0.7,
	    };

	    render(
	      <ImageRenderer
	        item={item}
	        layout="horizontal"
	        optixFlowConfig={optixFlowConfig}
	      />
	    );

	    const node = screen.getByTestId("img");
	    expect(node).toBeTruthy();
	    expect(imgInstances).toHaveLength(1);
	    const props = imgInstances[0];
	    expect(props.src).toBe("/img.jpg");
	    expect(props.alt).toBe("Example image");
	    expect(props.loading).toBe("lazy");
	    expect(props.optixFlowConfig).toEqual({
	      apiKey: "test-key",
	      compressionLevel: 0.7,
	    });
	  });
});

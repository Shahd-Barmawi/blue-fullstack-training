import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import HeroBlock from "./HeroBlock.vue";

describe("HeroBlock", () => {
  it("renders the hero block content", () => {
    const wrapper = mount(HeroBlock, {
      props: {
        content: {
          heading: "Welcome to Blue Tech",
          subheading: "Modern digital solutions for businesses.",
        },
      },
    });

    expect(wrapper.text()).toContain("Welcome to Blue Tech");
    expect(wrapper.text()).toContain(
      "Modern digital solutions for businesses.",
    );
  });
});

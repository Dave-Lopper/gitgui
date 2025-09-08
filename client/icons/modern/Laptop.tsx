import { IconProps, iconDefaultProps } from "../types";

export default function LaptopIcon(props: IconProps = iconDefaultProps) {
  return (
    <svg
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox="0 0 512 512"
    >
      <g>
        <path
          fill={props.color}
          d="M470.531,378.938c0.031-0.422,0.141-0.844,0.141-1.281v-248c0-12.875-10.547-23.406-23.406-23.406H64.734
		c-12.859,0-23.391,10.531-23.391,23.406v248c0,0.438,0.109,0.859,0.141,1.281H0v6.391c0,11.219,9.188,20.422,20.406,20.422h471.156
		c11.25,0,20.438-9.203,20.438-20.422v-6.391H470.531z M440.25,370.625H71.75V136.672h368.5V370.625z"
        />
      </g>
    </svg>
  );
}

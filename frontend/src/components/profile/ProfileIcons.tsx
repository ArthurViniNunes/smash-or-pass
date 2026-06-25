import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
	width: 20,
	height: 20,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.8,
	strokeLinecap: "round",
	strokeLinejoin: "round",
};

export function ProfileIcon() {
	return (
		<svg {...base}>
			<circle cx="12" cy="8" r="3.5" />
			<path d="M5 19c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
		</svg>
	);
}

export function RecipesIcon() {
	return (
		<svg {...base}>
			<path d="M6 3v7a2 2 0 0 0 4 0V3" />
			<path d="M8 10v11" />
			<path d="M16 3c-1.7 0-3 2.2-3 5 0 2.4 1.1 3.7 2 4v9" />
		</svg>
	);
}

export function PreferencesIcon() {
	return (
		<svg {...base}>
			<path d="M11 20A7 7 0 0 1 4 13C4 7 8 4 20 4c0 9-4 13-9 13z" />
			<path d="M4 21c1.8-5 5.5-8 10.5-9" />
		</svg>
	);
}

export function NotificationsIcon() {
	return (
		<svg {...base}>
			<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
			<path d="M10 20a2 2 0 0 0 4 0" />
		</svg>
	);
}

export function LogoutIcon() {
	return (
		<svg {...base}>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<path d="M16 17l5-5-5-5" />
			<path d="M21 12H9" />
		</svg>
	);
}

export function HelpIcon() {
	return (
		<svg {...base}>
			<circle cx="12" cy="12" r="9" />
			<path d="M9.5 9a2.5 2.5 0 0 1 4 2c0 1.6-2 2-2 3.5" />
			<path d="M12 16.5h.01" />
		</svg>
	);
}

export function AboutIcon() {
	return (
		<svg {...base}>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 11v5" />
			<path d="M12 8h.01" />
		</svg>
	);
}
'use client'

import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { scaleQuantile } from "d3-scale"
import { Tooltip } from "@/components/ui/tooltip"

// India TopoJSON URL
const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json"

// Mock Data for "Heatmap" or Project Locations
const projectLocations = [
    { name: "New Delhi", coordinates: [77.2090, 28.6139], projects: 5 },
    { name: "Mumbai", coordinates: [72.8777, 19.0760], projects: 3 },
    { name: "Bengaluru", coordinates: [77.5946, 12.9716], projects: 4 },
    { name: "Gurugram", coordinates: [77.0266, 28.4595], projects: 2 },
    { name: "Rajasthan", coordinates: [74.2179, 27.0238], projects: 2 }, // Approximate center
]

export default function ImpactMap() {
    const [tooltipContent, setTooltipContent] = useState("")

    return (
        <div className="w-full h-[400px] bg-sky-50/30 rounded-xl border border-blue-100 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-blue-800 shadow-sm">
                Live Impact Locations
            </div>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 1000,
                    center: [78.9629, 22.5937] // Center of India
                }}
                className="w-full h-full"
            >
                <Geographies geography={INDIA_TOPO_JSON}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            // Simple logic to highlight some states
                            const isActive = ["Delhi", "Maharashtra", "Karnataka", "Haryana", "Rajasthan"].includes(geo.properties.NAME_1)

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    className="outline-none transition-all duration-300"
                                    fill={isActive ? "#bfdbfe" : "#e2e8f0"} // blue-200 vs slate-200
                                    stroke="#ffffff"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "#60a5fa", outline: "none" }, // blue-400
                                        pressed: { fill: "#2563eb", outline: "none" }, // blue-600
                                    }}
                                />
                            )
                        })
                    }
                </Geographies>

                {projectLocations.map(({ name, coordinates, projects }) => (
                    <Marker key={name} coordinates={coordinates}>
                        <circle r={4} fill="#e11d48" stroke="#fff" strokeWidth={2} className="animate-pulse" />
                        <text
                            textAnchor="middle"
                            y={-10}
                            style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "10px", fontWeight: "bold" }}
                        >
                            {name} ({projects})
                        </text>
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    )
}

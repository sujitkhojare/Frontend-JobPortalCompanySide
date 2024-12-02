"use client" 
import {
    BellIcon,
    BriefcaseIcon,
    BuildingOfficeIcon,
    HomeIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode"; // Adjust your import as necessary
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

// Define the token decoding type
interface DecodedToken {
    id: string;
    exp: number;
    // Add other fields if necessary
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to manage error messages

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, targetPath: string) => {
        e.preventDefault(); // Prevent default link behavior

        const token = sessionStorage.getItem("token");

        if (!token) {
            // No token found, set error message and redirect to login
            setErrorMessage("Access denied Please log in !");
            router.push("/login");
            return;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                // Token expired
                setErrorMessage("Session expired. Please log in again.");
                sessionStorage.removeItem("token");
                router.push("/login");
            } else {
                // Token is valid, proceed to the target page
                setErrorMessage(null); // Clear any previous error message
                router.push(targetPath);
            }
        } catch (error) {
            console.error("Invalid token format:", error);
            setErrorMessage("An error occurred. Please log in again.");
            sessionStorage.removeItem("token");
            router.push("/login");
        }
    };

    return (
        <div className="mt-4 mb-4 w-72 bg-gradient-to-b from-blue-500 to-purple-600 p-4 rounded-lg shadow-lg sticky top-0 h-screen">
        {errorMessage && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
                {errorMessage}
            </div>
        )}
        <ul className="space-y-2">
            {/* Navigation Items */}
            <li className={pathname === "/" ? "font-bold" : ""}>
                <Link href="/" onClick={(e) => handleClick(e, "/")}>
                    <span className={`flex items-center py-3 px-4 rounded transition ${
                        pathname === "/" ? "bg-blue-700 text-white font-bold" : "text-white hover:bg-blue-500 cursor-pointer font-semibold"
                    }`}>
                        <HomeIcon className="h-6 w-6 mr-2" />
                        Dashboard
                    </span>
                </Link>
            </li>
                <li className={pathname === "/company-details" ? "font-bold" : ""}>
                    <Link href="/company-details" onClick={(e) => handleClick(e, "/company-details")}>
                        <span className={`flex items-center py-3 px-4 rounded transition ${
                            pathname === "/company-details" ? "bg-blue-700 text-white font-bold" : "text-white hover:bg-blue-500 cursor-pointer font-semibold"
                        }`}>
                            <BuildingOfficeIcon className="h-6 w-6 mr-2" />
                            Company Details
                        </span>
                    </Link>
                </li>
                <li className={pathname === "/jobs" ? "font-bold" : ""}>
                    <Link href="/jobs" onClick={(e) => handleClick(e, "/jobs")}>
                        <span className={`flex items-center py-3 px-4 rounded transition ${
                            pathname === "/jobs" ? "bg-blue-700 text-white font-bold" : "text-white hover:bg-blue-500 cursor-pointer font-semibold"
                        }`}>
                            <BriefcaseIcon className="h-6 w-6 mr-2" />
                            Jobs
                        </span>
                    </Link>
                </li>
                <li className={pathname === "/applied-jobs" ? "font-bold" : ""}>
                    <Link href="/applied-jobs" onClick={(e) => handleClick(e, "/applied-jobs")}>
                        <span className={`flex items-center py-3 px-4 rounded transition ${
                            pathname === "/applied-jobs" ? "bg-blue-700 text-white font-bold" : "text-white hover:bg-blue-500 cursor-pointer font-semibold"
                        }`}>
                            <BriefcaseIcon className="h-6 w-6 mr-2" />
                            Applied Jobs
                        </span>
                    </Link>
                </li>
                <li className={pathname === "/candidates" ? "font-bold" : ""}>
                    <Link href="/candidates" onClick={(e) => handleClick(e, "/candidates")}>
                        <span className={`flex items-center py-3 px-4 rounded transition ${
                            pathname === "/candidates" ? "bg-blue-700 text-white font-bold" : "text-white hover:bg-blue-500 cursor-pointer font-semibold"
                        }`}>
                            <UserGroupIcon className="h-6 w-6 mr-2" />
                            Candidates
                        </span>
                    </Link>
                </li>
                <li className={pathname === "/notifications" ? "font-bold" : ""}>
                    <Link href="/notifications" onClick={(e) => handleClick(e, "/notifications")}>
                        <span className={`flex items-center py-3 px-4 rounded transition ${
                            pathname === "/notifications" ? "bg-blue-700 text-white font-bold" : "text-white hover:bg-blue-500 cursor-pointer font-semibold"
                        }`}>
                            <BellIcon className="h-6 w-6 mr-2" />
                            Notifications
                        </span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

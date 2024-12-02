// app/components/Breadcrumbs.tsx
"use client";  // Mark this as a Client Component

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumbs = () => {
    const pathname = usePathname();
    
    // Split the pathname into an array of paths
    const pathArray = pathname.split('/').filter((path) => path);

    // Create a clickable breadcrumb for each segment
    return (
        <nav aria-label="breadcrumb">
            <ol className="flex space-x-2">
                {/* Home breadcrumb */}
                <li>
                    <Link href="/" className="text-blue-600 hover:underline">
                        Home
                    </Link>
                </li>

                {pathArray.map((path, index) => {
                    // Build the URL for each segment
                    const url = '/' + pathArray.slice(0, index + 1).join('/');
                    
                    // Capitalize the first letter of each segment for display
                    const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
                    
                    return (
                        <li key={index} className="flex items-center space-x-2">
                            <span>/</span> {/* Separator */}
                            <Link href={url} className="text-blue-600 hover:underline">
                                {formattedPath.replace(/-/g, ' ')} {/* Replace dashes with spaces */}
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;

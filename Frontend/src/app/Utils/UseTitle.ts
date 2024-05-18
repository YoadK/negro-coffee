import { useEffect } from "react";

// Custom React Hook:
function useTitle(title: string): void {
    // פעולה הדרושה בתוך קומפוננטה, אך מתבצעת פעם אחת
    // useEffect לכן חובה לבצע אותה בתוך
    // custom hook יכולה להיקרא או ישירות מתוך קומפוננטה, או מתוך useEffect
    
    useEffect(() => {
        document.title = title;
    }, []);
}

export default useTitle;

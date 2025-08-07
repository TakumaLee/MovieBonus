import * as React from "react"
import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

// Enhanced mobile detection hook for Safari iOS compatibility
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    const checkIsMobile = () => {
      // Multiple detection methods for Safari iOS compatibility
      const userAgent = navigator.userAgent.toLowerCase();
      const viewportWidth = window.innerWidth;
      const devicePixelRatio = window.devicePixelRatio;
      
      // Enhanced mobile detection specifically for Safari iOS
      const isSafariMobile = (
        /safari/.test(userAgent) && 
        /mobile/.test(userAgent) && 
        !/chrome|crios|fxios/.test(userAgent)
      );
      
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
      const isSmallViewport = viewportWidth <= 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Conservative mobile detection - if any mobile indicator is true, use mobile layout
      const mobile = isSafariMobile || isIOSDevice || isSmallViewport || 
        (isTouchDevice && viewportWidth <= 1024);
      
      setIsMobile(mobile);
    };
    
    // Check immediately
    checkIsMobile();
    
    // Check on resize with debounce
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', checkIsMobile);
      clearTimeout(timeoutId);
    };
  }, []);
  
  return { isMobile, isClient };
};

// Responsive Table component with enhanced JavaScript-based mobile detection
interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
  forceMobile?: boolean;
}

const ResponsiveTable = React.forwardRef<HTMLDivElement, ResponsiveTableProps>(
  ({ children, className, forceMobile = false }, ref) => {
    const { isMobile, isClient } = useIsMobile();
    const shouldUseMobileLayout = forceMobile || isMobile;
    
    // Show loading state or fallback during hydration
    if (!isClient) {
      return (
        <div ref={ref} className={cn("w-full max-w-full overflow-hidden", className)}>
          <div className="hidden md:block">
            <div className="relative w-full overflow-auto max-w-full">
              <table className="w-full caption-bottom text-sm max-w-full">
                {children}
              </table>
            </div>
          </div>
          <div className="md:hidden">
            {children}
          </div>
        </div>
      );
    }
    
    return (
      <div ref={ref} className={cn("w-full max-w-full overflow-hidden", className)}>
        {shouldUseMobileLayout ? (
          // Mobile Card View - JavaScript detected mobile
          <div className="w-full max-w-full overflow-hidden">
            {children}
          </div>
        ) : (
          // Desktop Table View
          <div className="w-full max-w-full">
            <div className="relative w-full overflow-auto max-w-full">
              <table className="w-full caption-bottom text-sm max-w-full">
                {children}
              </table>
            </div>
          </div>
        )}
        
        {/* Fallback CSS-only detection for edge cases */}
        <style jsx>{`
          @media screen and (max-width: 768px) {
            .responsive-table-container {
              max-width: 100vw !important;
              overflow-x: hidden !important;
            }
          }
        `}</style>
      </div>
    );
  }
)
ResponsiveTable.displayName = "ResponsiveTable"

// Enhanced ResponsiveTableBody with JavaScript-based mobile detection
interface ResponsiveTableBodyProps {
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
  forceMobile?: boolean;
}

const ResponsiveTableBody = React.forwardRef<HTMLElement, ResponsiveTableBodyProps>(
  ({ children, className, cardClassName, forceMobile = false }, ref) => {
    const { isMobile, isClient } = useIsMobile();
    const shouldUseMobileLayout = forceMobile || isMobile;
    
    // On desktop, render as normal tbody
    const desktopContent = (
      <tbody
        ref={ref as React.Ref<HTMLTableSectionElement>}
        className={cn("[&_tr:last-child]:border-0", className)}
      >
        {children}
      </tbody>
    )

    // On mobile, extract data from table rows and render as cards
    const mobileContent = (
      <div className="space-y-4 w-full max-w-full overflow-hidden px-4 box-border">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TableRow) {
            return (
              <div
                key={child.key}
                className={cn(
                  "border rounded-lg p-4 bg-card shadow-sm touch-manipulation w-full max-w-full overflow-hidden box-border",
                  cardClassName
                )}
                style={{
                  maxWidth: 'calc(100vw - 2rem)',
                  overflowX: 'hidden',
                  boxSizing: 'border-box'
                }}
              >
                <div className="w-full max-w-full overflow-hidden">
                  {child.props.children}
                </div>
              </div>
            )
          }
          return child
        })}
      </div>
    )
    
    // Show loading state during hydration with CSS fallback
    if (!isClient) {
      return (
        <>
          <div className="hidden md:block">{desktopContent}</div>
          <div className="md:hidden">{mobileContent}</div>
        </>
      );
    }

    return shouldUseMobileLayout ? mobileContent : desktopContent;
  }
)
ResponsiveTableBody.displayName = "ResponsiveTableBody"

// Enhanced mobile-optimized card item component with overflow protection
interface MobileCardItemProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const MobileCardItem: React.FC<MobileCardItemProps> = ({ label, children, className }) => (
  <div className={cn("flex justify-between items-start gap-3 min-h-[48px] w-full max-w-full overflow-hidden", className)}>
    <span className="text-sm font-medium text-muted-foreground flex-shrink-0 max-w-[40%] overflow-hidden text-ellipsis">
      {label}:
    </span>
    <div className="text-sm text-right flex-1 max-w-[60%] overflow-hidden break-words">
      {children}
    </div>
  </div>
)

// Enhanced touch-friendly button wrapper with overflow protection
interface TouchFriendlyButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({ 
  children, 
  className,
  onClick 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "min-h-[48px] min-w-[48px] p-3 rounded-lg transition-colors",
      "touch-manipulation active:scale-95",
      "hover:bg-accent hover:text-accent-foreground",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "max-w-full overflow-hidden box-border",
      "whitespace-nowrap text-ellipsis",
      className
    )}
    style={{
      maxWidth: 'calc(100vw - 2rem)',
      boxSizing: 'border-box'
    }}
  >
    <span className="block truncate">{children}</span>
  </button>
)

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  ResponsiveTable,
  ResponsiveTableBody,
  MobileCardItem,
  TouchFriendlyButton,
}

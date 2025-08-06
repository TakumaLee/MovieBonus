import * as React from "react"

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

// Responsive Table component that switches between table and card layout
interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveTable = React.forwardRef<HTMLDivElement, ResponsiveTableProps>(
  ({ children, className }, ref) => (
    <div ref={ref} className={cn("w-full", className)}>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            {children}
          </table>
        </div>
      </div>
      
      {/* Mobile Card View - will be handled by ResponsiveTableBody */}
      <div className="md:hidden">
        {children}
      </div>
    </div>
  )
)
ResponsiveTable.displayName = "ResponsiveTable"

// ResponsiveTableBody that renders cards on mobile
interface ResponsiveTableBodyProps {
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
}

const ResponsiveTableBody = React.forwardRef<HTMLElement, ResponsiveTableBodyProps>(
  ({ children, className, cardClassName }, ref) => {
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
      <div className="space-y-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TableRow) {
            return (
              <div
                key={child.key}
                className={cn(
                  "border rounded-lg p-4 bg-card shadow-sm touch-manipulation",
                  cardClassName
                )}
              >
                {child.props.children}
              </div>
            )
          }
          return child
        })}
      </div>
    )

    return (
      <>
        <div className="hidden md:block">{desktopContent}</div>
        <div className="md:hidden">{mobileContent}</div>
      </>
    )
  }
)
ResponsiveTableBody.displayName = "ResponsiveTableBody"

// Mobile-optimized card item component
interface MobileCardItemProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const MobileCardItem: React.FC<MobileCardItemProps> = ({ label, children, className }) => (
  <div className={cn("flex justify-between items-start gap-3 min-h-[48px]", className)}>
    <span className="text-sm font-medium text-muted-foreground flex-shrink-0">{label}:</span>
    <div className="text-sm text-right flex-1">{children}</div>
  </div>
)

// Touch-friendly button wrapper
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
      className
    )}
  >
    {children}
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

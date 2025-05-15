"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Calendar({
  className,
  selected,
  onSelect,
  mode = "single",
  disabled,
  ...props
}) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  // Generate days for the current month view including days from previous/next months to fill the grid
  const days = React.useMemo(() => {
    const firstDayOfMonth = startOfMonth(currentMonth)
    const lastDayOfMonth = endOfMonth(currentMonth)
    
    // Get the first day of the week containing the first day of the month
    const start = startOfWeek(firstDayOfMonth)
    // Get the last day of the week containing the last day of the month
    const end = endOfWeek(lastDayOfMonth)
    
    return eachDayOfInterval({ start, end })
  }, [currentMonth])
  
  // Get day names for header
  const weekDays = React.useMemo(() => {
    return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  }, [])
  
  // Handle month navigation
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1))
  }
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }
  
  // Handle day selection
  const handleSelectDay = (day) => {
    if (onSelect) {
      onSelect(day)
    }
  }
  
  // Check if a day is selected
  const isDaySelected = (day) => {
    if (!selected) return false
    return isSameDay(day, selected)
  }
  
  // Check if a day is disabled
  const isDayDisabled = (day) => {
    if (!disabled) return false
    return disabled(day)
  }
  
  // Check if a day is in the current month
  const isCurrentMonth = (day) => {
    return isSameMonth(day, currentMonth)
  }
  
  return (
    <div className={cn("p-3", className)} {...props}>
      {/* Header with month navigation */}
      <div className="flex justify-center pt-1 relative items-center w-full">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-1 size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="size-4" />
        </Button>
        
        <div className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-1 size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          onClick={handleNextMonth}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
      
      {/* Calendar grid */}
      <div className="mt-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className="text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 mt-2">
          {days.map((day, index) => {
            const isSelected = isDaySelected(day)
            const isDisabled = isDayDisabled(day)
            const isTodayDate = isToday(day)
            const isInCurrentMonth = isCurrentMonth(day)
            
            return (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className={cn(
                  "size-8 p-0 font-normal",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  isTodayDate && !isSelected && "bg-accent text-accent-foreground",
                  !isInCurrentMonth && "text-muted-foreground opacity-50",
                  isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed"
                )}
                disabled={isDisabled}
                onClick={() => !isDisabled && handleSelectDay(day)}
              >
                {format(day, "d")}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }

"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { InvoiceData } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"

interface InvoiceFormProps {
  onSubmit: (data: InvoiceData) => void
  isSubmitting: boolean
}

export function InvoiceForm({ onSubmit, isSubmitting }: InvoiceFormProps) {
  const { t, dir } = useLanguage()
  const [total, setTotal] = useState<number>(0)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<InvoiceData>({
    defaultValues: {
      invoiceNumber: "",
      date: formatDate(new Date().toISOString()),
      clientName: "",
      lineItems: [
        {
          id: uuidv4(),
          description: "",
          quantity: 1,
          price: 0,
          subtotal: 0,
        },
      ],
      currency: "FCFA",
      total: 0,
      notes: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  })

  // Watch for changes to calculate total
  const lineItems = watch("lineItems")
  const currency = watch("currency")

  // Generate invoice number on first load
  useEffect(() => {
    // Get the last invoice number from localStorage
    const lastInvoiceNumber = localStorage.getItem("lastInvoiceNumber")
    let newInvoiceNumber = "FACT-001"

    if (lastInvoiceNumber) {
      // Extract the number part and increment
      const match = lastInvoiceNumber.match(/FACT-(\d+)/)
      if (match && match[1]) {
        const num = Number.parseInt(match[1], 10)
        newInvoiceNumber = `FACT-${String(num + 1).padStart(3, "0")}`
      }
    }

    setValue("invoiceNumber", newInvoiceNumber)
  }, [setValue])

  // Calculate subtotals and total when line items change
  useEffect(() => {
    let calculatedTotal = 0

    lineItems.forEach((item, index) => {
      // Make sure we have valid numbers
      const quantity = typeof item.quantity === "number" ? item.quantity : 0
      const price = typeof item.price === "number" ? item.price : 0

      // Calculate subtotal
      const subtotal = quantity * price

      // Update the subtotal in the form state
      setValue(`lineItems.${index}.subtotal`, subtotal)

      // Add to total
      calculatedTotal += subtotal
    })

    // Update total
    setTotal(calculatedTotal)
    setValue("total", calculatedTotal)
  }, [lineItems, setValue])

  const calculateTotal = () => {
    // Get the current values of all line items
    const currentLineItems = getValues("lineItems")

    // Calculate the total from all valid subtotals
    const calculatedTotal = currentLineItems.reduce((sum, item) => {
      // Make sure we have valid numbers
      const subtotal = typeof item.subtotal === "number" ? item.subtotal : 0
      return sum + subtotal
    }, 0)

    // Update the total state and form value
    setTotal(calculatedTotal)
    setValue("total", calculatedTotal)
  }

  const addLineItem = () => {
    append({
      id: uuidv4(),
      description: "",
      quantity: 1,
      price: 0,
      subtotal: 0,
    })

    // Recalculate the total after adding a new item
    // Use setTimeout to ensure the new item is in the form state
    setTimeout(() => calculateTotal(), 0)
  }

  const onFormSubmit = (data: InvoiceData) => {
    // Save the invoice number for next time
    localStorage.setItem("lastInvoiceNumber", data.invoiceNumber)
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" dir={dir}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">{t.invoice.form.invoiceNumber}</Label>
          <Input id="invoiceNumber" {...register("invoiceNumber", { required: true })} />
          {errors.invoiceNumber && <p className="text-red-500 text-sm">{t.invoice.form.invoiceNumber} is required</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">{t.invoice.form.date}</Label>
          <Input id="date" type="date" {...register("date", { required: true })} />
          {errors.date && <p className="text-red-500 text-sm">{t.invoice.form.date} is required</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientName">{t.invoice.form.clientName}</Label>
        <Input id="clientName" {...register("clientName", { required: true })} />
        {errors.clientName && <p className="text-red-500 text-sm">{t.invoice.form.clientName} is required</p>}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>{t.invoice.form.items}</Label>
          <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>{t.invoice.form.addItem}</span>
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`lineItems.${index}.description`}>{t.invoice.form.description}</Label>
                <Textarea
                  id={`lineItems.${index}.description`}
                  {...register(`lineItems.${index}.description` as const, { required: true })}
                />
                {errors.lineItems?.[index]?.description && (
                  <p className="text-red-500 text-sm">{t.invoice.form.description} is required</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`lineItems.${index}.quantity`}>{t.invoice.form.quantity}</Label>
                  <Input
                    id={`lineItems.${index}.quantity`}
                    type="number"
                    min="1"
                    step="1"
                    {...register(`lineItems.${index}.quantity` as const, {
                      required: true,
                      valueAsNumber: true,
                      min: 1,
                      onChange: (e) => {
                        // Force immediate re-calculation when input changes
                        const currentValue = Number.parseFloat(e.target.value) || 0
                        const price = lineItems[index]?.price || 0
                        const subtotal = currentValue * price
                        setValue(`lineItems.${index}.subtotal`, subtotal)

                        // Recalculate the total
                        calculateTotal()
                      },
                    })}
                  />
                  {errors.lineItems?.[index]?.quantity && (
                    <p className="text-red-500 text-sm">Valid {t.invoice.form.quantity} is required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`lineItems.${index}.price`}>{t.invoice.form.price}</Label>
                  <Input
                    id={`lineItems.${index}.price`}
                    type="number"
                    min="0"
                    step="0.01"
                    {...register(`lineItems.${index}.price` as const, {
                      required: true,
                      valueAsNumber: true,
                      min: 0,
                      onChange: (e) => {
                        // Force immediate re-calculation when input changes
                        const currentValue = Number.parseFloat(e.target.value) || 0
                        const quantity = lineItems[index]?.quantity || 0
                        const subtotal = quantity * currentValue
                        setValue(`lineItems.${index}.subtotal`, subtotal)

                        // Recalculate the total
                        calculateTotal()
                      },
                    })}
                  />
                  {errors.lineItems?.[index]?.price && (
                    <p className="text-red-500 text-sm">Valid {t.invoice.form.price} is required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t.invoice.form.subtotal}</Label>
                  <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                    {currency} {(lineItems[index]?.subtotal || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    remove(index)
                    // Recalculate the total after removing an item
                    setTimeout(() => calculateTotal(), 0)
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{t.invoice.form.removeItem}</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">{t.invoice.form.currency}</Label>
        <Select defaultValue="FCFA" onValueChange={(value) => setValue("currency", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FCFA">FCFA</SelectItem>
            <SelectItem value="€">€ (EUR)</SelectItem>
            <SelectItem value="$">$ (USD)</SelectItem>
            <SelectItem value="NGN">NGN (Naira)</SelectItem>
            <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border">
        <div className="flex justify-between items-center">
          <span className="font-medium">{t.invoice.form.total}:</span>
          <span className="text-xl font-bold">
            {currency} {total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t.invoice.form.notes}</Label>
        <Textarea id="notes" {...register("notes")} placeholder={t.invoice.form.notesPlaceholder} />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t.invoice.form.generating : t.invoice.form.generate}
      </Button>
    </form>
  )
}

"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { InvoiceData } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/language-context";

interface InvoiceFormProps {
  onSubmit: (data: InvoiceData) => void;
  isSubmitting: boolean;
}

export function InvoiceForm({ onSubmit, isSubmitting }: InvoiceFormProps) {
  const { t, dir } = useLanguage();
  const [total, setTotal] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);

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
      clientAddress: "",
      businessName: "",
      businessAddress: "",
      businessTin: "",
      businessRcNumber: "",
      vatRate: 7.5,
      pricesIncludeVat: false,
      paymentTerms: "Due on Receipt",
      paymentTermsCustom: "",
      lineItems: [
        {
          id: uuidv4(),
          description: "",
          quantity: 1,
          price: 0,
          tax: 0,
          subtotal: 0,
        },
      ],
      currency: "FCFA",
      total: 0,
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  // Watch for changes to calculate total
  const lineItems = watch("lineItems");
  const currency = watch("currency");
  const invoiceNumber = watch("invoiceNumber");
  const vatRate = watch("vatRate");
  const pricesIncludeVat = watch("pricesIncludeVat");

  // Generate invoice number on first load
  useEffect(() => {
    // Get the last invoice number from localStorage
    const lastInvoiceNumber = localStorage.getItem("lastInvoiceNumber");
    if (lastInvoiceNumber) {
      setValue("invoiceNumber", lastInvoiceNumber);
    }
  }, [setValue]);

  // Calculate subtotals and total when line items change
  useEffect(() => {
    let calculatedTotal = 0;
    let calculatedTaxAmount = 0;

    lineItems.forEach((item, index) => {
      const quantity = typeof item.quantity === "number" ? item.quantity : 0;
      const price = typeof item.price === "number" ? item.price : 0;

      // Calculate subtotal before tax
      const subtotalBeforeTax = quantity * price;

      // Calculate tax amount based on VAT rate
      const itemTaxAmount = (subtotalBeforeTax * vatRate) / 100;

      // Calculate final subtotal
      const subtotal = pricesIncludeVat
        ? subtotalBeforeTax
        : subtotalBeforeTax + itemTaxAmount;

      // Update the subtotal in the form state
      setValue(`lineItems.${index}.subtotal`, subtotal);
      setValue(`lineItems.${index}.tax`, itemTaxAmount);

      // Add to totals
      calculatedTotal += subtotal;
      calculatedTaxAmount += itemTaxAmount;
    });

    // Update totals
    setTotal(calculatedTotal);
    setTaxAmount(calculatedTaxAmount);
    setValue("total", calculatedTotal);
  }, [lineItems, vatRate, pricesIncludeVat, setValue]);

  const calculateTotal = () => {
    // Get the current values of all line items
    const currentLineItems = getValues("lineItems");
    let calculatedTotal = 0;
    let calculatedTaxAmount = 0;

    // Calculate the total from all valid subtotals
    currentLineItems.forEach((item) => {
      const quantity = typeof item.quantity === "number" ? item.quantity : 0;
      const price = typeof item.price === "number" ? item.price : 0;
      const tax = typeof item.tax === "number" ? item.tax : 0;

      const subtotalBeforeTax = quantity * price;
      const itemTaxAmount = (subtotalBeforeTax * tax) / 100;
      const subtotal = subtotalBeforeTax + itemTaxAmount;

      calculatedTotal += subtotal;
      calculatedTaxAmount += itemTaxAmount;
    });

    // Update the totals
    setTotal(calculatedTotal);
    setTaxAmount(calculatedTaxAmount);
    setValue("total", calculatedTotal);
  };

  const addLineItem = () => {
    append({
      id: uuidv4(),
      description: "",
      quantity: 1,
      price: 0,
      tax: 0,
      subtotal: 0,
    });

    // Recalculate the total after adding a new item
    setTimeout(() => calculateTotal(), 0);
  };

  const onFormSubmit = (data: InvoiceData) => {
    // Save the invoice number for next time
    localStorage.setItem("lastInvoiceNumber", data.invoiceNumber);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" dir={dir}>
      {/* Business Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              {...register("businessName", { required: true })}
            />
            {errors.businessName && (
              <p className="text-red-500 text-sm">This field is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress">Business Address</Label>
            <Textarea
              id="businessAddress"
              {...register("businessAddress", { required: true })}
            />
            {errors.businessAddress && (
              <p className="text-red-500 text-sm">This field is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessPhone">Business Phone</Label>
            <Input
              id="businessPhone"
              type="tel"
              {...register("businessPhone")}
              placeholder="+1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessEmail">Business Email</Label>
            <Input
              id="businessEmail"
              type="email"
              {...register("businessEmail")}
              placeholder="business@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessTin">Tax Identification Number (TIN)</Label>
            <Input
              id="businessTin"
              {...register("businessTin", {
                pattern: /^[0-9]{8,14}(-[0-9]{4})?$/,
                maxLength: 15,
              })}
              placeholder="e.g., 01234567-0001"
            />
            {errors.businessTin && (
              <p className="text-red-500 text-sm">
                Invalid TIN format (e.g., 01234567-0001)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessRcNumber">
              Company Registration Number (RC)
            </Label>
            <Input
              id="businessRcNumber"
              {...register("businessRcNumber", {
                pattern: /^(RC)?[0-9]{1,15}$/,
                maxLength: 15,
              })}
              placeholder="e.g., RC1234567"
            />
            {errors.businessRcNumber && (
              <p className="text-red-500 text-sm">
                Invalid RC Number format (e.g., RC1234567)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Client Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Client Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="clientName">{t.invoice.form.clientName}</Label>
            <Input
              id="clientName"
              {...register("clientName", { required: true })}
            />
            {errors.clientName && (
              <p className="text-red-500 text-sm">This field is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea id="clientAddress" {...register("clientAddress")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientTin">Client TIN</Label>
            <Input
              id="clientTin"
              {...register("clientTin", {
                pattern: /^[0-9]{8,14}(-[0-9]{4})?$/,
                maxLength: 15,
              })}
              placeholder="e.g., 01234567-0001"
            />
            {errors.clientTin && (
              <p className="text-red-500 text-sm">
                Invalid TIN format (e.g., 01234567-0001)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* VAT Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">VAT Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="vatRate">VAT Rate (%)</Label>
            <Input
              id="vatRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              {...register("vatRate", {
                required: true,
                min: 0,
                max: 100,
                valueAsNumber: true,
              })}
            />
            {errors.vatRate && (
              <p className="text-red-500 text-sm">
                VAT rate must be between 0 and 100
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Prices Include VAT</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="pricesIncludeVat"
                {...register("pricesIncludeVat")}
                className="h-4 w-4"
              />
              <Label htmlFor="pricesIncludeVat" className="text-sm">
                Check if prices already include VAT
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Select
              defaultValue="Due on Receipt"
              onValueChange={(value) => {
                setValue("paymentTerms", value);
                if (value !== "custom") {
                  setValue("paymentTermsCustom", "");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                <SelectItem value="Net 7">Net 7</SelectItem>
                <SelectItem value="Net 15">Net 15</SelectItem>
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {watch("paymentTerms") === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="paymentTermsCustom">Custom Payment Terms</Label>
              <Input
                id="paymentTermsCustom"
                {...register("paymentTermsCustom", {
                  required: watch("paymentTerms") === "custom",
                })}
              />
              {errors.paymentTermsCustom && (
                <p className="text-red-500 text-sm">This field is required</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Existing Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>{t.invoice.form.invoiceNumber}</Label>
          <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
            {invoiceNumber || t.invoice.form.generating}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">{t.invoice.form.date}</Label>
          <Input
            id="date"
            type="date"
            {...register("date", { required: true })}
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{t.invoice.form.required}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>{t.invoice.form.items}</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLineItem}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t.invoice.form.addItem}</span>
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`lineItems.${index}.description`}>
                  {t.invoice.form.description}
                </Label>
                <Textarea
                  id={`lineItems.${index}.description`}
                  {...register(`lineItems.${index}.description` as const, {
                    required: true,
                  })}
                />
                {errors.lineItems?.[index]?.description && (
                  <p className="text-red-500 text-sm">
                    {t.invoice.form.description} is required
                  </p>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`lineItems.${index}.quantity`}>
                    {t.invoice.form.quantity}
                  </Label>
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
                        const currentValue =
                          Number.parseFloat(e.target.value) || 0;
                        const price = lineItems[index]?.price || 0;
                        const tax = lineItems[index]?.tax || 0;
                        const subtotalBeforeTax = currentValue * price;
                        const taxAmount = (subtotalBeforeTax * tax) / 100;
                        const subtotal = subtotalBeforeTax + taxAmount;
                        setValue(`lineItems.${index}.subtotal`, subtotal);
                        calculateTotal();
                      },
                    })}
                  />
                  {errors.lineItems?.[index]?.quantity && (
                    <p className="text-red-500 text-sm">
                      Valid {t.invoice.form.quantity} is required
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`lineItems.${index}.price`}>
                    {t.invoice.form.price}
                  </Label>
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
                        const currentValue =
                          Number.parseFloat(e.target.value) || 0;
                        const quantity = lineItems[index]?.quantity || 0;
                        const tax = lineItems[index]?.tax || 0;
                        const subtotalBeforeTax = quantity * currentValue;
                        const taxAmount = (subtotalBeforeTax * tax) / 100;
                        const subtotal = subtotalBeforeTax + taxAmount;
                        setValue(`lineItems.${index}.subtotal`, subtotal);
                        calculateTotal();
                      },
                    })}
                  />
                  {errors.lineItems?.[index]?.price && (
                    <p className="text-red-500 text-sm">
                      Valid {t.invoice.form.price} is required
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`lineItems.${index}.tax`}>Tax %</Label>
                  <Input
                    id={`lineItems.${index}.tax`}
                    type="number"
                    min="0"
                    step="0.01"
                    {...register(`lineItems.${index}.tax` as const, {
                      required: true,
                      valueAsNumber: true,
                      min: 0,
                      onChange: (e) => {
                        const currentValue =
                          Number.parseFloat(e.target.value) || 0;
                        const quantity = lineItems[index]?.quantity || 0;
                        const price = lineItems[index]?.price || 0;
                        const subtotalBeforeTax = quantity * price;
                        const taxAmount =
                          (subtotalBeforeTax * currentValue) / 100;
                        const subtotal = subtotalBeforeTax + taxAmount;
                        setValue(`lineItems.${index}.subtotal`, subtotal);
                        calculateTotal();
                      },
                    })}
                  />
                  {errors.lineItems?.[index]?.tax && (
                    <p className="text-red-500 text-sm">
                      Valid tax percentage is required
                    </p>
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
                    remove(index);
                    setTimeout(() => calculateTotal(), 0);
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
        <Select
          defaultValue="FCFA"
          onValueChange={(value) => setValue("currency", value)}
        >
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

      <div className="p-4 bg-gray-50 rounded-lg border space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Tax Amount:</span>
          <span className="text-lg">
            {currency} {taxAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">{t.invoice.form.total}:</span>
          <span className="text-xl font-bold">
            {currency} {total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t.invoice.form.notes}</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder={t.invoice.form.notesPlaceholder}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t.invoice.form.generating : t.invoice.form.generate}
      </Button>
    </form>
  );
}

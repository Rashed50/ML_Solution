// app/invoice/create/page.tsx
'use client';

import { useState } from 'react';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: string;
  unitPrice: number;
  taxPercent: number;
  lineTotal: number;
}

interface InvoiceFormData {
  // Invoice Header
  invoiceNumber: string;
  issueDate: string;
  loanNo: string;
  poNo: string;
  contractNo: string;
  invoiceTypeCode: string;
  documentCurrency: string;
  taxCurrency: string;
  
  // Invoice Date Section
  invoiceDate: string;
  invoiceReference: string;
  
  // Seller Information
  sellerName: string;
  sellerBuildingNo: string;
  sellerCRNo: string;
  sellerStreetName: string;
  sellerDistrict: string;
  sellerCity: string;
  sellerCountry: string;
  sellerPostalCode: string;
  sellerAdditionalNo: string;
  sellerVATNumber: string;
  
  // Buyer Information
  buyerName: string;
  buyerBuildingNo: string;
  buyerCRNo: string;
  buyerStreetName: string;
  buyerDistrict: string;
  buyerCity: string;
  buyerCountry: string;
  buyerPostalCode: string;
  buyerAdditionalNo: string;
  buyerVATNumber: string;
  
  // Bank Information
  bankAccount: string;
  bankName: string;
  bankCity: string;
  beneficiaryName: string;
  ibanNo: string;
  
  // Items
  items: InvoiceItem[];
  
  // Totals
  description: string;
}

interface SectionState {
  invoiceHeader: boolean;
  invoiceDateInfo: boolean;
  sellerInfo: boolean;
  buyerInfo: boolean;
  invoiceItems: boolean;
  bankInfo: boolean;
  description: boolean;
  invoiceTotals: boolean;
}

export default function InvoiceCreatePage() {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: '',
    issueDate: '',
    loanNo: '',
    poNo: '',
    contractNo: '',
    invoiceTypeCode: '388',
    documentCurrency: 'SAR',
    taxCurrency: 'SAR',
    invoiceDate: '',
    invoiceReference: '',
    sellerName: '',
    sellerBuildingNo: '',
    sellerCRNo: '',
    sellerStreetName: '',
    sellerDistrict: '',
    sellerCity: '',
    sellerCountry: 'KSA',
    sellerPostalCode: '',
    sellerAdditionalNo: '',
    sellerVATNumber: '',
    buyerName: '',
    buyerBuildingNo: '',
    buyerCRNo: '',
    buyerStreetName: '',
    buyerDistrict: '',
    buyerCity: '',
    buyerCountry: 'KSA',
    buyerPostalCode: '',
    buyerAdditionalNo: '',
    buyerVATNumber: '',
    bankAccount: '',
    bankName: '',
    bankCity: 'KSA',
    beneficiaryName: '',
    ibanNo: '',
    items: [
      {
        id: '1.0',
        name: '',
        quantity: 'LS (إل إس)',
        unitPrice: 0,
        taxPercent: 15.0,
        lineTotal: 0
      }
    ],
    description: 'This is computer generated invoice and do not require any stamp or signature.'
  });

  const [sectionState, setSectionState] = useState<SectionState>({
    invoiceHeader: true,
    invoiceDateInfo: true,
    sellerInfo: false,
    buyerInfo: false,
    invoiceItems: true,
    bankInfo: false,
    description: false,
    invoiceTotals: true
  });

  const toggleSection = (section: keyof SectionState) => {
    setSectionState(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Recalculate line total if unit price or quantity changes
    if (field === 'unitPrice' || field === 'quantity') {
      const quantity = field === 'quantity' ? parseFloat(value as string) || 0 : updatedItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? parseFloat(value as string) || 0 : updatedItems[index].unitPrice;
      updatedItems[index].lineTotal = unitPrice;
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `${prev.items.length + 1}.0`,
          name: '',
          quantity: 'LS (إل إس)',
          unitPrice: 0,
          taxPercent: 15.0,
          lineTotal: 0
        }
      ]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  const calculateTotals = () => {
    const lineExtensionAmount = formData.items.reduce((sum, item) => sum + item.lineTotal, 0);
    const taxAmount = formData.items.reduce((sum, item) => sum + (item.lineTotal * item.taxPercent / 100), 0);
    const taxInclusiveAmount = lineExtensionAmount + taxAmount;

    return {
      lineExtensionAmount,
      taxAmount,
      taxInclusiveAmount,
      payableAmount: taxInclusiveAmount
    };
  };

  const totals = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/generate-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totals
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `invoice-${formData.invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to generate invoice');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  const FormSection = ({ 
    title, 
    children, 
    isOpen, 
    onToggle 
  }: { 
    title: string; 
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex justify-between items-center"
      >
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );

  const FormField = ({ label, name, value, onChange, type = "text", placeholder = "" }: {
    label: string;
    name: keyof InvoiceFormData;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
  }) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Create Invoice
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Invoice Header Section */}
            <FormSection 
              title="Invoice Header" 
              isOpen={sectionState.invoiceHeader}
              onToggle={() => toggleSection('invoiceHeader')}
            >
              <FormField
                label="Invoice Number"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(value) => handleInputChange('invoiceNumber', value)}
                placeholder="ABCC/LTHSC/JAF/PH-2/GCP4/MP/INVOICE-010"
              />
              <FormField
                label="Issue Date"
                name="issueDate"
                value={formData.issueDate}
                onChange={(value) => handleInputChange('issueDate', value)}
                type="date"
              />
              <FormField
                label="LOA No"
                name="loanNo"
                value={formData.loanNo}
                onChange={(value) => handleInputChange('loanNo', value)}
              />
              <FormField
                label="PO No"
                name="poNo"
                value={formData.poNo}
                onChange={(value) => handleInputChange('poNo', value)}
                placeholder="7400061929"
              />
              <FormField
                label="Contract No"
                name="contractNo"
                value={formData.contractNo}
                onChange={(value) => handleInputChange('contractNo', value)}
                placeholder="NA"
              />
              <FormField
                label="Invoice Type Code"
                name="invoiceTypeCode"
                value={formData.invoiceTypeCode}
                onChange={(value) => handleInputChange('invoiceTypeCode', value)}
                placeholder="388"
              />
              <FormField
                label="Document Currency"
                name="documentCurrency"
                value={formData.documentCurrency}
                onChange={(value) => handleInputChange('documentCurrency', value)}
                placeholder="SAR"
              />
              <FormField
                label="Tax Currency"
                name="taxCurrency"
                value={formData.taxCurrency}
                onChange={(value) => handleInputChange('taxCurrency', value)}
                placeholder="SAR"
              />
            </FormSection>

            {/* Invoice Date Section */}
            <FormSection 
              title="Invoice Date Information" 
              isOpen={sectionState.invoiceDateInfo}
              onToggle={() => toggleSection('invoiceDateInfo')}
            >
              <FormField
                label="Invoice Date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={(value) => handleInputChange('invoiceDate', value)}
                type="date"
              />
              <div className="md:col-span-2">
                <FormField
                  label="Invoice Reference"
                  name="invoiceReference"
                  value={formData.invoiceReference}
                  onChange={(value) => handleInputChange('invoiceReference', value)}
                  placeholder="MANPOWER SUPPLY FOR GCP 04 (توريد القوى العاملة لـ GCP 04)"
                />
              </div>
            </FormSection>

            {/* Seller Information */}
            <FormSection 
              title="Seller Information" 
              isOpen={sectionState.sellerInfo}
              onToggle={() => toggleSection('sellerInfo')}
            >
              <div className="md:col-span-2">
                <FormField
                  label="Seller Name"
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={(value) => handleInputChange('sellerName', value)}
                  placeholder="Asloob Bedaa Contracting Company | شركة أصلوب بدعة للمقاولات"
                />
              </div>
              <FormField
                label="Building No"
                name="sellerBuildingNo"
                value={formData.sellerBuildingNo}
                onChange={(value) => handleInputChange('sellerBuildingNo', value)}
              />
              <FormField
                label="CR No"
                name="sellerCRNo"
                value={formData.sellerCRNo}
                onChange={(value) => handleInputChange('sellerCRNo', value)}
                placeholder="1010647321 | ١٠١٠٦٤٧٣٢١"
              />
              <FormField
                label="Street Name"
                name="sellerStreetName"
                value={formData.sellerStreetName}
                onChange={(value) => handleInputChange('sellerStreetName', value)}
              />
              <FormField
                label="District"
                name="sellerDistrict"
                value={formData.sellerDistrict}
                onChange={(value) => handleInputChange('sellerDistrict', value)}
              />
              <FormField
                label="City"
                name="sellerCity"
                value={formData.sellerCity}
                onChange={(value) => handleInputChange('sellerCity', value)}
                placeholder="Riyadh"
              />
              <FormField
                label="Country"
                name="sellerCountry"
                value={formData.sellerCountry}
                onChange={(value) => handleInputChange('sellerCountry', value)}
                placeholder="KSA"
              />
              <FormField
                label="Postal Code"
                name="sellerPostalCode"
                value={formData.sellerPostalCode}
                onChange={(value) => handleInputChange('sellerPostalCode', value)}
                placeholder="12611"
              />
              <FormField
                label="Additional No"
                name="sellerAdditionalNo"
                value={formData.sellerAdditionalNo}
                onChange={(value) => handleInputChange('sellerAdditionalNo', value)}
                placeholder="P.O.Box 4915"
              />
              <FormField
                label="VAT Number"
                name="sellerVATNumber"
                value={formData.sellerVATNumber}
                onChange={(value) => handleInputChange('sellerVATNumber', value)}
                placeholder="311244907100003"
              />
            </FormSection>

            {/* Buyer Information */}
            <FormSection 
              title="Buyer Information" 
              isOpen={sectionState.buyerInfo}
              onToggle={() => toggleSection('buyerInfo')}
            >
              <div className="md:col-span-2">
                <FormField
                  label="Buyer Name"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={(value) => handleInputChange('buyerName', value)}
                  placeholder="L & T Hydrocarbon Saudi Company | شركة ال اند تي هيدروكربون السعودية"
                />
              </div>
              <FormField
                label="Building No"
                name="buyerBuildingNo"
                value={formData.buyerBuildingNo}
                onChange={(value) => handleInputChange('buyerBuildingNo', value)}
                placeholder="6883"
              />
              <FormField
                label="CR No"
                name="buyerCRNo"
                value={formData.buyerCRNo}
                onChange={(value) => handleInputChange('buyerCRNo', value)}
                placeholder="2050055625 | ٢٠٥٠٠٥٥٦٢٥"
              />
              <FormField
                label="Street Name"
                name="buyerStreetName"
                value={formData.buyerStreetName}
                onChange={(value) => handleInputChange('buyerStreetName', value)}
                placeholder="King Abdulaziz Road"
              />
              <FormField
                label="District"
                name="buyerDistrict"
                value={formData.buyerDistrict}
                onChange={(value) => handleInputChange('buyerDistrict', value)}
                placeholder="Al- Khobar Shamalia"
              />
              <FormField
                label="City"
                name="buyerCity"
                value={formData.buyerCity}
                onChange={(value) => handleInputChange('buyerCity', value)}
                placeholder="Al- Khobar"
              />
              <FormField
                label="Country"
                name="buyerCountry"
                value={formData.buyerCountry}
                onChange={(value) => handleInputChange('buyerCountry', value)}
                placeholder="KSA"
              />
              <FormField
                label="Postal Code"
                name="buyerPostalCode"
                value={formData.buyerPostalCode}
                onChange={(value) => handleInputChange('buyerPostalCode', value)}
                placeholder="34428"
              />
              <FormField
                label="Additional No"
                name="buyerAdditionalNo"
                value={formData.buyerAdditionalNo}
                onChange={(value) => handleInputChange('buyerAdditionalNo', value)}
                placeholder="2nd Floor"
              />
              <FormField
                label="VAT Number"
                name="buyerVATNumber"
                value={formData.buyerVATNumber}
                onChange={(value) => handleInputChange('buyerVATNumber', value)}
                placeholder="300464605700003"
              />
            </FormSection>

            {/* Invoice Items */}
            <FormSection 
              title="Invoice Items" 
              isOpen={sectionState.invoiceItems}
              onToggle={() => toggleSection('invoiceItems')}
            >
              <div className="md:col-span-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-700">Item {index + 1}</h3>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <FormField
                          label="Item Name"
                          name="name"
                          value={item.name}
                          onChange={(value) => handleItemChange(index, 'name', value)}
                          placeholder="Manpower Supply for Jafurah Gas Compression Plants..."
                        />
                      </div>
                      <FormField
                        label="Quantity"
                        name="quantity"
                        value={item.quantity}
                        onChange={(value) => handleItemChange(index, 'quantity', value)}
                        placeholder="LS (إل إس)"
                      />
                      <FormField
                        label="Unit Price (SAR)"
                        name="unitPrice"
                        value={item.unitPrice.toString()}
                        onChange={(value) => handleItemChange(index, 'unitPrice', parseFloat(value) || 0)}
                        type="number"
                      />
                      <FormField
                        label="Tax Percent (%)"
                        name="taxPercent"
                        value={item.taxPercent.toString()}
                        onChange={(value) => handleItemChange(index, 'taxPercent', parseFloat(value) || 0)}
                        type="number"
                      />
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Line Total (SAR)</label>
                        <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                          {item.lineTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Add Item
                </button>
              </div>
            </FormSection>

            {/* Bank Information */}
            <FormSection 
              title="Bank Information" 
              isOpen={sectionState.bankInfo}
              onToggle={() => toggleSection('bankInfo')}
            >
              <FormField
                label="Bank Account"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={(value) => handleInputChange('bankAccount', value)}
                placeholder="11897865001 | ١١٨٩٧٨٦٥٠٠١"
              />
              <FormField
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                onChange={(value) => handleInputChange('bankName', value)}
                placeholder="SA SABB | (سا ساب)"
              />
              <FormField
                label="Bank City"
                name="bankCity"
                value={formData.bankCity}
                onChange={(value) => handleInputChange('bankCity', value)}
                placeholder="KSA"
              />
              <FormField
                label="Beneficiary Name"
                name="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={(value) => handleInputChange('beneficiaryName', value)}
                placeholder="ASLOOB BEDAA CONTRACTING COMPANY (شركة أصلوب بدعة للمقاولات)"
              />
              <div className="md:col-span-2">
                <FormField
                  label="IBAN No"
                  name="ibanNo"
                  value={formData.ibanNo}
                  onChange={(value) => handleInputChange('ibanNo', value)}
                  placeholder="SA3545 0000 000 11897865001"
                />
              </div>
            </FormSection>

            {/* Description */}
            <FormSection 
              title="Description" 
              isOpen={sectionState.description}
              onToggle={() => toggleSection('description')}
            >
              <div className="md:col-span-2">
                <FormField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  placeholder="This is computer generated invoice and do not require any stamp or signature."
                />
              </div>
            </FormSection>

            {/* Totals Summary */}
            <FormSection 
              title="Invoice Totals" 
              isOpen={sectionState.invoiceTotals}
              onToggle={() => toggleSection('invoiceTotals')}
            >
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-semibold">Line Extension Amount:</span>
                    <span className="font-mono">{totals.lineExtensionAmount.toFixed(2)} SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Tax Amount:</span>
                    <span className="font-mono">{totals.taxAmount.toFixed(2)} SAR</span>
                  </div>
                  <div className="flex justify-between md:col-span-2">
                    <span className="font-semibold text-lg">Total Payable Amount:</span>
                    <span className="font-mono text-lg font-bold">{totals.payableAmount.toFixed(2)} SAR</span>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Generate Invoice PDF
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
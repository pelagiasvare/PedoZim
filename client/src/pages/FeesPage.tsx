import React, { useState } from 'react';
import {
  Receipt,
  CreditCard,
  DollarSign,
  Search,
  Filter,
  Plus,
  Printer,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';
import { FeeInvoice, FeePayment, PaymentMethod } from '../types';
import { dataService } from '../services/dataService';

export const FeesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<FeeInvoice[]>(dataService.getInvoices());
  const [payments, setPayments] = useState<FeePayment[]>(dataService.getPayments());

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'ZiG'>('USD');

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);
  const [receiptToPrint, setReceiptToPrint] = useState<FeePayment | null>(null);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EcoCash');
  const [paymentNotes, setPaymentNotes] = useState('');

  const refreshData = () => {
    setInvoices(dataService.getInvoices());
    setPayments(dataService.getPayments());
  };

  const handleOpenPayment = (inv: FeeInvoice) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.balance > 0 ? inv.balance : 50);
    setPaymentNotes('');
    setIsPaymentModalOpen(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const payment = dataService.recordPayment(
      selectedInvoice.id,
      paymentAmount,
      paymentMethod,
      'Mrs. Chipo Ndlovu (Bursar)',
      paymentNotes
    );

    setIsPaymentModalOpen(false);
    refreshData();
    setReceiptToPrint(payment);
  };

  // Metrics
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalDue, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balance, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fees & Accounts Management</h1>
          <p className="page-subtitle">
            Manage tuition levies, track payments, accept EcoCash & bank settlements, and issue official receipts
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedCurrency(selectedCurrency === 'USD' ? 'ZiG' : 'USD')}
          >
            Currency: <strong>{selectedCurrency}</strong>
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Invoiced</span>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              <Receipt size={22} />
            </div>
          </div>
          <div className="stat-val">${totalInvoiced.toLocaleString()} {selectedCurrency}</div>
          <div className="stat-meta">Term 3 2026 Academic Session</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Collected</span>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <DollarSign size={22} />
            </div>
          </div>
          <div className="stat-val" style={{ color: '#34d399' }}>
            ${totalCollected.toLocaleString()} {selectedCurrency}
          </div>
          <div className="stat-meta">
            <span className="badge badge-success">
              {Math.round((totalCollected / totalInvoiced) * 100)}% Collected
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Outstanding Balance</span>
            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              <CreditCard size={22} />
            </div>
          </div>
          <div className="stat-val" style={{ color: '#f87171' }}>
            ${totalOutstanding.toLocaleString()} {selectedCurrency}
          </div>
          <div className="stat-meta">Pending collection from parents</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="topbar-search" style={{ width: '320px' }}>
            <Search size={16} className="topbar-search-icon" />
            <input
              type="text"
              placeholder="Search by student or admission #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="Paid">Fully Paid</option>
              <option value="Partial">Partially Paid</option>
              <option value="Overdue">Overdue / Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fee Invoices Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Admission #</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Tuition & Levy</th>
              <th>Total Due</th>
              <th>Amount Paid</th>
              <th>Outstanding</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id}>
                <td>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#818cf8' }}>
                    {inv.admissionNumber}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{inv.studentName}</td>
                <td>{inv.className}</td>
                <td>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Tuition: ${inv.tuitionFee} • Levy: ${inv.levyFee}
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>${inv.totalDue}</td>
                <td style={{ color: '#34d399', fontWeight: 700 }}>${inv.amountPaid}</td>
                <td style={{ color: inv.balance === 0 ? 'var(--text-muted)' : '#f87171', fontWeight: 700 }}>
                  ${inv.balance}
                </td>
                <td>
                  <span
                    className={`badge ${
                      inv.status === 'Paid'
                        ? 'badge-success'
                        : inv.status === 'Partial'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenPayment(inv)}
                  >
                    <CreditCard size={14} /> Pay Fee
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setIsPaymentModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Record Fee Payment</h2>
              <button className="icon-btn" onClick={() => setIsPaymentModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment}>
              <div className="modal-body">
                <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{selectedInvoice.studentName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Admission: {selectedInvoice.admissionNumber} • {selectedInvoice.className}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <span>Current Outstanding:</span>
                    <strong style={{ color: '#f87171' }}>${selectedInvoice.balance} {selectedInvoice.currency}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Amount ({selectedInvoice.currency}) *</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedInvoice.balance > 0 ? selectedInvoice.balance : 1000}
                    className="form-input"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method *</label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    <option value="EcoCash">EcoCash (Mobile Money)</option>
                    <option value="Bank Transfer">Bank Transfer (CBZ / Stanbic / FBC)</option>
                    <option value="Cash">Cash (Bursar Office)</option>
                    <option value="Card">Debit / Credit Card (POS / Swipe)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reference / Transaction Notes</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. EcoCash ref: MP261028.1234 or Bank slip #"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsPaymentModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald">
                  <CheckCircle2 size={16} /> Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Payment Receipt Modal */}
      {receiptToPrint && (
        <div className="modal-overlay" onClick={() => setReceiptToPrint(null)}>
          <div className="modal-content" style={{ maxWidth: '600px', background: '#ffffff', color: '#0f172a' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  Harare Central High School
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Finance & Bursary Department • P.O. Box 450, Harare
                </div>
                <div style={{ marginTop: '0.5rem', fontWeight: 800, fontSize: '0.95rem', background: '#10b981', color: 'white', display: 'inline-block', padding: '0.15rem 1rem', borderRadius: '4px' }}>
                  OFFICIAL PAYMENT RECEIPT
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <div><strong>Receipt No:</strong> {receiptToPrint.receiptNumber}</div>
                <div><strong>Date:</strong> {receiptToPrint.paymentDate}</div>
              </div>

              <div style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '6px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div><strong>Received From:</strong> {receiptToPrint.studentName}</div>
                <div><strong>Payment Method:</strong> {receiptToPrint.paymentMethod}</div>
                {receiptToPrint.notes && <div><strong>Reference:</strong> {receiptToPrint.notes}</div>}
                <div><strong>Cashier:</strong> {receiptToPrint.recordedBy}</div>
                <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '0.5rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#047857' }}>
                  <span>AMOUNT PAID:</span>
                  <span>${receiptToPrint.amount} {receiptToPrint.currency}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                Thank you for your timely settlement. This document serves as valid proof of payment.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  style={{ padding: '0.6rem 1.25rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => window.print()}
                >
                  <Printer size={16} /> Print Receipt
                </button>
                <button
                  type="button"
                  style={{ padding: '0.6rem 1.25rem', background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => setReceiptToPrint(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

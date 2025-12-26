import { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function AdminNotifications() {
    const { adminNotifications, shopConfig } = usePage<PageProps>().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [seenAlerts, setSeenAlerts] = useState<string[]>([]);
    const [seenReports, setSeenReports] = useState<string[]>([]);
    const [showNewAlert, setShowNewAlert] = useState(false);
    const [activeTab, setActiveTab] = useState<'alerts' | 'reports'>('alerts');
    const [isInitialized, setIsInitialized] = useState(false);
    const [prevAlertCount, setPrevAlertCount] = useState<number | null>(null);
    const [prevReportCount, setPrevReportCount] = useState<number | null>(null);

    // Load seen items from localStorage on mount
    useEffect(() => {
        const storedAlerts = localStorage.getItem('seenLowStockAlerts');
        const storedReports = localStorage.getItem('seenDailySalesReports');
        if (storedAlerts) setSeenAlerts(JSON.parse(storedAlerts));
        if (storedReports) setSeenReports(JSON.parse(storedReports));
        setIsInitialized(true);
    }, []);

    // Poll for new notifications every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['adminNotifications'] });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Check for new alerts/reports - only after localStorage is loaded
    useEffect(() => {
        if (!isInitialized || !adminNotifications) return;

        const currentAlertCount = adminNotifications.recentAlerts.length;
        const currentReportCount = adminNotifications.recentReports.length;

        // Show toast if count increased (new notification arrived)
        const hasNewAlerts = prevAlertCount !== null && currentAlertCount > prevAlertCount;
        const hasNewReports = prevReportCount !== null && currentReportCount > prevReportCount;

        if (hasNewAlerts || hasNewReports) {
            setShowNewAlert(true);
            const timer = setTimeout(() => setShowNewAlert(false), 5000);
            // Update counts immediately to prevent re-triggering
            setPrevAlertCount(currentAlertCount);
            setPrevReportCount(currentReportCount);
            return () => clearTimeout(timer);
        }

        setPrevAlertCount(currentAlertCount);
        setPrevReportCount(currentReportCount);
    }, [adminNotifications, isInitialized, prevAlertCount, prevReportCount]);

    if (!adminNotifications) return null;

    const { lowStockCount, soldOutCount, recentAlerts, recentReports } = adminNotifications;
    const totalIssues = lowStockCount + soldOutCount;
    const unseenAlertCount = recentAlerts.filter(a => !seenAlerts.includes(a.id)).length;
    const unseenReportCount = recentReports.filter(r => !seenReports.includes(r.id)).length;
    const totalUnseen = unseenAlertCount + unseenReportCount;

    const markAllAsSeen = () => {
        const allAlertIds = recentAlerts.map(a => a.id);
        const allReportIds = recentReports.map(r => r.id);
        setSeenAlerts(allAlertIds);
        setSeenReports(allReportIds);
        localStorage.setItem('seenLowStockAlerts', JSON.stringify(allAlertIds));
        localStorage.setItem('seenDailySalesReports', JSON.stringify(allReportIds));
        setShowNewAlert(false);
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) markAllAsSeen();
                }}
                className="relative p-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Admin notifications"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>

                {(totalIssues > 0 || recentReports.length > 0) && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {totalIssues + recentReports.length > 99 ? '99+' : totalIssues + recentReports.length}
                    </span>
                )}

                {totalUnseen > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    </span>
                )}
            </button>

            {showNewAlert && !isOpen && (() => {
                // Find the most recent notification (alert or report)
                const latestAlert = recentAlerts[recentAlerts.length - 1];
                const latestReport = recentReports[recentReports.length - 1];

                const alertTime = latestAlert ? new Date(latestAlert.sent_at).getTime() : 0;
                const reportTime = latestReport ? new Date(latestReport.sent_at).getTime() : 0;

                // Show the most recent one
                if (reportTime > alertTime && latestReport) {
                    return (
                        <div className="absolute right-0 top-12 z-50 w-80 animate-slide-in">
                            <div className="bg-gradient-to-r from-emerald-900/90 to-emerald-800/90 backdrop-blur-xl border border-emerald-500/50 rounded-lg p-4 shadow-2xl">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">Daily Sales Report</p>
                                        <p className="mt-1 text-sm text-emerald-200 truncate">
                                            {latestReport.message}
                                        </p>
                                        <p className="mt-1 text-xs text-emerald-300">Email report sent</p>
                                    </div>
                                    <button
                                        onClick={() => setShowNewAlert(false)}
                                        className="flex-shrink-0 text-emerald-300 hover:text-white"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                } else if (latestAlert) {
                    return (
                        <div className="absolute right-0 top-12 z-50 w-80 animate-slide-in">
                            <div className="bg-gradient-to-r from-red-900/90 to-red-800/90 backdrop-blur-xl border border-red-500/50 rounded-lg p-4 shadow-2xl">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">Low Stock Alert</p>
                                        <p className="mt-1 text-sm text-red-200 truncate">
                                            {latestAlert.product_name} - Only {latestAlert.stock_quantity} left!
                                        </p>
                                        <p className="mt-1 text-xs text-red-300">Email notification sent</p>
                                    </div>
                                    <button
                                        onClick={() => setShowNewAlert(false)}
                                        className="flex-shrink-0 text-red-300 hover:text-white"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }
                return null;
            })()}

            {isOpen && (
                <div className="absolute right-0 top-12 z-50 w-96 max-h-[70vh] overflow-hidden bg-neutral-900/95 backdrop-blur-xl border border-neutral-700 rounded-xl shadow-2xl">
                        <div className="border-b border-neutral-800">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveTab('alerts')}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                        activeTab === 'alerts'
                                            ? 'text-white border-b-2 border-orange-500'
                                            : 'text-neutral-400 hover:text-white'
                                    }`}
                                >
                                    Inventory Alerts
                                    {unseenAlertCount > 0 && (
                                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                            {unseenAlertCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('reports')}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                        activeTab === 'reports'
                                            ? 'text-white border-b-2 border-emerald-500'
                                            : 'text-neutral-400 hover:text-white'
                                    }`}
                                >
                                    Sales Reports
                                    {unseenReportCount > 0 && (
                                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-emerald-500 text-white rounded-full">
                                            {unseenReportCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {activeTab === 'alerts' && (
                            <>
                                <div className="grid grid-cols-2 gap-px bg-neutral-800">
                                    <div className="bg-neutral-900 p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                            <span className="text-xs text-neutral-400 uppercase tracking-wide">Low Stock</span>
                                        </div>
                                        <p className="mt-1 text-2xl font-bold text-white">{lowStockCount}</p>
                                    </div>
                                    <div className="bg-neutral-900 p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            <span className="text-xs text-neutral-400 uppercase tracking-wide">Sold Out</span>
                                        </div>
                                        <p className="mt-1 text-2xl font-bold text-white">{soldOutCount}</p>
                                    </div>
                                </div>

                                <div className="max-h-64 overflow-y-auto">
                                    {recentAlerts.length > 0 ? (
                                        <div className="divide-y divide-neutral-800">
                                            {[...recentAlerts].reverse().map((alert) => (
                                                <Link
                                                    key={alert.id}
                                                    href={`/admin/products/${alert.product_id}/edit`}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-800/50 transition-colors"
                                                >
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-900/50 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">
                                                            {alert.product_name}
                                                        </p>
                                                        <p className="text-xs text-neutral-400">
                                                            {alert.stock_quantity} units remaining
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0 text-xs text-neutral-500">
                                                        {formatTime(alert.sent_at)}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-8 text-center">
                                            <svg className="w-10 h-10 mx-auto text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="mt-2 text-sm text-neutral-500">No recent alerts</p>
                                        </div>
                                    )}
                                </div>

                                <div className="px-4 py-3 border-t border-neutral-800">
                                    <Link
                                        href="/admin/products"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center text-sm text-orange-500 hover:text-orange-400 font-medium"
                                    >
                                        View All Products →
                                    </Link>
                                </div>
                            </>
                        )}

                        {activeTab === 'reports' && (
                            <>
                                <div className="max-h-80 overflow-y-auto">
                                    {recentReports.length > 0 ? (
                                        <div className="divide-y divide-neutral-800">
                                            {[...recentReports].reverse().map((report) => (
                                                <details
                                                    key={report.id}
                                                    className="group"
                                                >
                                                    <summary className="px-4 py-3 hover:bg-neutral-800/50 transition-colors cursor-pointer list-none">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-900/50 flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-medium text-white">
                                                                        {report.date}
                                                                    </p>
                                                                    <svg className="w-4 h-4 text-neutral-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                </div>
                                                                <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                                                                    <span>{report.total_orders} orders</span>
                                                                    <span>•</span>
                                                                    <span>${report.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                                    <span>•</span>
                                                                    <span>{report.total_items} items</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex-shrink-0 text-xs text-neutral-500">
                                                                {formatTime(report.sent_at)}
                                                            </div>
                                                        </div>
                                                    </summary>
                                                    {report.products_sold && report.products_sold.length > 0 && (
                                                        <div className="px-4 pb-3 pt-1 ml-11">
                                                            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">Products Sold</p>
                                                            <div className="space-y-1">
                                                                {report.products_sold.map((product) => (
                                                                    <div key={product.id} className="flex items-center justify-between text-xs">
                                                                        <span className="text-neutral-300 truncate flex-1">{product.name}</span>
                                                                        <span className="text-neutral-500 ml-2">{product.quantity}x</span>
                                                                        <span className="text-emerald-400 ml-2">${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </details>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-8 text-center">
                                            <svg className="w-10 h-10 mx-auto text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="mt-2 text-sm text-neutral-500">No recent reports</p>
                                        </div>
                                    )}
                                </div>

                                <div className="px-4 py-3 border-t border-neutral-800">
                                    <p className="text-center text-xs text-neutral-500">
                                        Reports are sent daily at {shopConfig.dailyReportTime}
                                    </p>
                                </div>
                            </>
                        )}
                </div>
            )}
        </div>
    );
}


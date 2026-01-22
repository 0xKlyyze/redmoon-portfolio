
import React from 'react';
import * as Icons from 'lucide-react';

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
}

const AVAILABLE_ICONS = [
    // General / UI
    'Activity', 'AlertCircle', 'AlertTriangle', 'Archive', 'ArrowRight', 'ArrowUpRight', 'AtSign', 'Award',
    'Bell', 'Bookmark', 'Box', 'Briefcase', 'Calendar', 'Check', 'CheckCircle', 'ChevronRight',
    'Circle', 'Clock', 'Cloud', 'Code', 'Command', 'Compass', 'Copy', 'Cpu', 'CreditCard',
    'Database', 'Disc', 'Download', 'Edit', 'Edit2', 'ExternalLink', 'Eye', 'File', 'FileText',
    'Filter', 'Flag', 'Folder', 'Gift', 'Globe', 'Grid', 'HardDrive', 'Hash', 'Heart',
    'Home', 'Image', 'Inbox', 'Info', 'Key', 'Layers', 'Layout', 'LifeBuoy', 'Link', 'Link2',
    'List', 'Loader', 'Lock', 'Mail', 'Map', 'MapPin', 'Maximize', 'Menu', 'MessageCircle',
    'MessageSquare', 'Mic', 'Minus', 'Monitor', 'Moon', 'MoreHorizontal', 'MoreVertical',
    'MousePointer', 'Move', 'Music', 'Navigation', 'Package', 'Paperclip', 'Pause', 'PenTool',
    'Phone', 'PieChart', 'Play', 'PlayCircle', 'Plus', 'PlusCircle', 'Power', 'Printer',
    'Radio', 'RefreshCw', 'Repeat', 'Rocket', 'Save', 'Scissors', 'Search', 'Send', 'Server',
    'Settings', 'Share', 'Share2', 'Shield', 'ShoppingBag', 'ShoppingCart', 'Shuffle',
    'Sidebar', 'Smartphone', 'Smile', 'Speaker', 'Square', 'Star', 'StopCircle', 'Sun',
    'Tablet', 'Tag', 'Target', 'Terminal', 'Thermometer', 'ThumbsUp', 'ToggleLeft', 'ToggleRight',
    'Tool', 'Trash', 'Trash2', 'TrendingUp', 'Triangle', 'Truck', 'Tv', 'Twitter', 'Type',
    'Umbrella', 'Unlock', 'Upload', 'User', 'UserCheck', 'UserMinus', 'UserPlus', 'Users',
    'Video', 'Voicemail', 'Volume', 'Volume2', 'Watch', 'Wifi', 'Wind', 'X', 'XCircle', 'Zap',
    'ZoomIn', 'ZoomOut',

    // Tech / Dev Specific
    'Binary', 'Blocks', 'Braces', 'Bug', 'CircuitBoard', 'CloudLightning', 'CloudRain',
    'Code2', 'Container', 'DatabaseBackup', 'FileCode', 'FileJson', 'FileDigit',
    'Fingerprint', 'FunctionSquare', 'GitBranch', 'GitCommit', 'GitMerge', 'GitPullRequest',
    'Globe2', 'Laptop', 'Laptop2', 'Network', 'QrCode', 'RadioReceiver', 'Ratio',
    'Regex', 'Replace', 'RotateCw', 'Router', 'Scale', 'Scan', 'ScanFace', 'ScreenShare',
    'Scroll', 'ServerCrash', 'ServerOff', 'Signal', 'Siren', 'Slack', 'Sparkles', 'Spline',
    'Split', 'Stamp', 'StickyNote', 'StretchHorizontal', 'StretchVertical',
    'Subtitles', 'SwitchCamera', 'Table', 'Table2', 'Tags', 'Tally5', 'Unplug', 'Usb',
    'Variable', 'View', 'Wrench'
];

export default function IconPicker({ value, onChange }: IconPickerProps) {
    return (
        <div className="grid grid-cols-6 gap-2 p-2 bg-black/20 border border-white/10 rounded-lg max-h-48 overflow-y-auto custom-scrollbar">
            {AVAILABLE_ICONS.map((iconName) => {
                // @ts-ignore
                const Icon = Icons[iconName];
                const isSelected = value === iconName;

                return (
                    <button
                        key={iconName}
                        type="button"
                        onClick={() => onChange(iconName)}
                        className={`p-2 rounded-lg flex items-center justify-center transition-all group ${isSelected
                            ? 'bg-tech-blue text-white shadow-[0_0_10px_rgba(42,157,255,0.5)]'
                            : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                            }`}
                        title={iconName}
                    >
                        {Icon ? <Icon className="w-5 h-5" /> : <span className="text-xs">?</span>}
                    </button>
                );
            })}
        </div>
    );
}

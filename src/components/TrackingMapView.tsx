import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map, 
  MapPin, 
  Navigation, 
  Search, 
  Users, 
  Wrench, 
  Phone, 
  Mail, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Compass, 
  CheckCircle, 
  Layers,
  Route,
  Activity,
  UserCheck
} from 'lucide-react';
import { Customer, Technician, Booking } from '../types';

// Let's rich-map coordinate and address info for each entity to provide realistic geolocation displays.
const CITY_LANDMARKS: Record<string, { name: string; x: number; y: number }[]> = {
  'Dhaka': [
    { name: 'Banani Lake', x: 45, y: 40 },
    { name: 'Mirpur Road', x: 25, y: 55 },
    { name: 'Dhaka University', x: 50, y: 80 },
    { name: 'Gulshan Circle', x: 65, y: 35 },
    { name: 'Parliament House', x: 30, y: 65 }
  ],
  'Mumbai': [
    { name: 'Marine Drive', x: 30, y: 80 },
    { name: 'Gateway of India', x: 45, y: 90 },
    { name: 'Bandra-Worli Sealink', x: 25, y: 45 },
    { name: 'Andheri Hub', x: 60, y: 30 },
    { name: 'Chhatrapati Shivaji Terminal', x: 55, y: 75 }
  ],
  'Delhi': [
    { name: 'Connaught Place', x: 50, y: 50 },
    { name: 'India Gate', x: 60, y: 60 },
    { name: 'Red Fort', x: 75, y: 35 },
    { name: 'Qutub Minar', x: 35, y: 85 },
    { name: 'Karol Bagh Market', x: 35, y: 40 }
  ],
  'Bangalore': [
    { name: 'Cubbon Park', x: 45, y: 45 },
    { name: 'Lalbagh Botanical', x: 40, y: 70 },
    { name: 'MG Road Junction', x: 65, y: 40 },
    { name: 'Electronic City Toll', x: 80, y: 85 },
    { name: 'Indiranagar Main', x: 70, y: 30 }
  ],
  'Karachi': [
    { name: 'Clifton Beach', x: 35, y: 85 },
    { name: 'Mazar-e-Quaid', x: 55, y: 50 },
    { name: 'Karachi Port', x: 25, y: 70 },
    { name: 'Saddar Market', x: 45, y: 60 },
    { name: 'Liaquatabad Interchange', x: 65, y: 30 }
  ]
};

// Preset addresses and geocoordinates for mock customers and technicians
const GEOLOCATIONS: Record<string, { address: string; x: number; y: number; lat: number; lng: number }> = {
  // Customers
  'CUST-3049': { address: 'Bandra West, Mumbai, India', x: 35, y: 55, lat: 19.0596, lng: 72.8295 },
  'CUST-8102': { address: 'Connaught Place, New Delhi, India', x: 48, y: 52, lat: 28.6304, lng: 77.2177 },
  'CUST-5512': { address: 'Road 11, Banani, Dhaka, Bangladesh', x: 48, y: 45, lat: 23.7937, lng: 90.4046 },
  'CUST-9821': { address: 'Juhu Scheme, Mumbai, India', x: 65, y: 35, lat: 19.1075, lng: 72.8263 },
  'CUST-4112': { address: 'Karol Bagh, New Delhi, India', x: 32, y: 42, lat: 28.6453, lng: 77.1907 },
  
  // Technicians
  'TECH-101': { address: 'Andheri East, Mumbai, India', x: 58, y: 32, lat: 19.1136, lng: 72.8697 },
  'TECH-102': { address: 'Dwarka Sector 6, New Delhi, India', x: 28, y: 68, lat: 28.5921, lng: 77.0652 },
  'TECH-103': { address: 'Indiranagar, Bangalore, India', x: 68, y: 32, lat: 12.9718, lng: 77.6411 },
  'TECH-104': { address: 'Colaba Causeway, Mumbai, India', x: 42, y: 85, lat: 18.9152, lng: 72.8260 },
  'TECH-105': { address: 'Block 4 Clifton, Karachi, Pakistan', x: 32, y: 78, lat: 24.8138, lng: 67.0336 },
  'TECH-106': { address: 'Mirpur Section 2, Dhaka, Bangladesh', x: 28, y: 72, lat: 23.8055, lng: 90.3621 }
};

interface TrackingMapViewProps {
  customers: Customer[];
  technicians: Technician[];
  bookings: Booking[];
  focusedId: string | null;
  onClearFocus: () => void;
}

export default function TrackingMapView({ 
  customers, 
  technicians, 
  bookings, 
  focusedId, 
  onClearFocus 
}: TrackingMapViewProps) {
  // Supported Hubs selection based on existing technician cities
  const hubs = ['Dhaka', 'Mumbai', 'Delhi', 'Bangalore', 'Karachi'];
  const [selectedHub, setSelectedHub] = useState<string>('Dhaka');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Technician' | 'Customer'>('All');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  
  // Simulation Movement State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  // Auto-switch hub if focusedId belongs to a specific hub
  useEffect(() => {
    if (focusedId) {
      // Find entity check
      const tech = technicians.find(t => t.id === focusedId);
      if (tech) {
        setSelectedHub(tech.city);
        setSelectedEntityId(focusedId);
        return;
      }
      
      const cust = customers.find(c => c.id === focusedId);
      if (cust) {
        // Find which hub a customer belongs to using our GEOLOCATIONS database
        const info = GEOLOCATIONS[focusedId];
        if (info) {
          if (info.address.includes('Dhaka')) setSelectedHub('Dhaka');
          else if (info.address.includes('Mumbai')) setSelectedHub('Mumbai');
          else if (info.address.includes('Delhi')) setSelectedHub('Delhi');
          else if (info.address.includes('Bangalore')) setSelectedHub('Bangalore');
          else if (info.address.includes('Karachi')) setSelectedHub('Karachi');
        }
        setSelectedEntityId(focusedId);
      }
    }
  }, [focusedId, technicians, customers]);

  // Simulation loop effect that moves technicians toward booking customers (if they have active bookings)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimStep(prev => (prev < 100 ? prev + 1.5 : 0));
      }, 150);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating]);

  // Reset simulation completely
  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimStep(0);
  };

  // Get active matches inside current hub to draw routing lines
  const activeBookings = useMemo(() => {
    return bookings.filter(b => {
      if (b.status !== 'Live') return false;
      const tech = technicians.find(t => t.id === b.technicianId);
      return tech && tech.city === selectedHub;
    });
  }, [bookings, technicians, selectedHub]);

  // Merge directory entities that fall within selected city hub
  const hubEntities = useMemo(() => {
    const list: {
      id: string;
      name: string;
      type: 'Customer' | 'Technician';
      status: string;
      avatar: string;
      phone: string;
      category?: string;
      address: string;
      x: number;
      y: number;
      lat: number;
      lng: number;
      rating?: number;
    }[] = [];

    // Filter customers
    customers.forEach(cust => {
      const geo = GEOLOCATIONS[cust.id];
      if (geo && geo.address.includes(selectedHub)) {
        list.push({
          id: cust.id,
          name: cust.name,
          type: 'Customer',
          status: cust.status,
          avatar: cust.avatar,
          phone: cust.phone,
          address: geo.address,
          x: geo.x,
          y: geo.y,
          lat: geo.lat,
          lng: geo.lng
        });
      }
    });

    // Filter technicians
    technicians.forEach(tech => {
      const geo = GEOLOCATIONS[tech.id];
      if (geo && tech.city === selectedHub) {
        list.push({
          id: tech.id,
          name: tech.name,
          type: 'Technician',
          status: tech.status,
          avatar: tech.avatar,
          phone: tech.phone,
          category: tech.category,
          address: geo.address,
          x: geo.x,
          y: geo.y,
          lat: geo.lat,
          lng: geo.lng,
          rating: tech.rating
        });
      }
    });

    return list;
  }, [customers, technicians, selectedHub]);

  // Search and type filtering logic
  const filteredEntities = useMemo(() => {
    return hubEntities.filter(ent => {
      const matchesSearch = ent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            ent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (ent.category && ent.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            ent.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterType === 'All') return matchesSearch;
      return matchesSearch && ent.type === filterType;
    });
  }, [hubEntities, searchTerm, filterType]);

  const selectedEntity = useMemo(() => {
    return hubEntities.find(e => e.id === selectedEntityId);
  }, [hubEntities, selectedEntityId]);

  // Compute live positioning based on simulation step
  const getCoordinates = (entity: typeof hubEntities[0]) => {
    if (entity.type === 'Customer' || !isSimulating) {
      return { x: entity.x, y: entity.y };
    }

    // If technician has a live dispatch booking, slide their position towards the customer
    const activeBooking = activeBookings.find(b => b.technicianId === entity.id);
    if (activeBooking) {
      const customerGeo = GEOLOCATIONS[activeBooking.customerId];
      if (customerGeo) {
        const factor = simStep / 100;
        // Linear Interpolation
        return {
          x: entity.x + (customerGeo.x - entity.x) * factor,
          y: entity.y + (customerGeo.y - entity.y) * factor
        };
      }
    }

    // Just subtle wandering/breathing offset for idle technicians while simulating
    const breathingOffset = Math.sin((simStep * Math.PI) / 10) * 1.5;
    return {
      x: entity.x + breathingOffset,
      y: entity.y - breathingOffset
    };
  };

  return (
    <div className="space-y-6" id="tracking-view-container">
      {/* View Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="tracking-header">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
              Live Dispatch & Locations
            </h1>
            <span className="p-0.5 px-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-[10px] rounded uppercase font-mono tracking-wider flex items-center gap-1">
              <Activity className="h-3 w-3 animate-pulse" /> Live Tracker
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            রিয়েল-টাইম কাস্টমার এবং মিস্ত্রি (Technician) লোকেশন ট্র্যাকিং ও ডিসপ্যাচ মনিটর
          </p>
        </div>
        
        {/* Simulation Dashboard Controls */}
        <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-2 px-3 rounded-xl shadow-inner">
          <div className="text-right mr-1 hidden sm:block">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Simulate Dispatch Flow</p>
            <p className={`text-xs font-bold ${isSimulating ? 'text-cyan-400' : 'text-slate-400'}`}>
              {isSimulating ? 'Simulating Movement...' : 'System Idle (Static)'}
            </p>
          </div>
          <button
            id="btn-toggle-simulation"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`p-2.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
              isSimulating 
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/10' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold'
            }`}
            title={isSimulating ? 'Pause Motion Simulation' : 'Start Motion Simulation'}
          >
            {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-slate-950" />}
          </button>
          <button
            id="btn-reset-simulation"
            onClick={handleResetSimulation}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-all border border-slate-700"
            title="Reset Simulation Progress"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hub selector tabs */}
      <div className="flex flex-wrap gap-2" id="operating-hubs-bar">
        {hubs.map(hubName => {
          const count = technicians.filter(t => t.city === hubName).length;
          return (
            <button
              id={`hub-selector-${hubName}`}
              key={hubName}
              onClick={() => {
                setSelectedHub(hubName);
                setSelectedEntityId(null);
                onClearFocus();
              }}
              className={`p-2.5 px-4 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer border ${
                selectedHub === hubName
                  ? 'bg-cyan-600 text-slate-950 border-cyan-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800/80 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <Compass className={`h-4 w-4 ${selectedHub === hubName ? 'text-slate-950 animate-spin-slow' : 'text-slate-500'}`} />
              <span>{hubName} Hub</span>
              <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded ${
                selectedHub === hubName ? 'bg-slate-950 text-cyan-400' : 'bg-slate-950 text-slate-500'
              }`}>
                {count} Mistri
              </span>
            </button>
          );
        })}
      </div>

      {focusedId && (
        <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3 px-4 text-xs text-cyan-300 flex justify-between items-center animate-pulse" id="focused-georoute-banner">
          <span className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-cyan-400 animate-bounce" />
            Showing focused georoute and proximity details for <strong>{focusedId}</strong>.
          </span>
          <button 
            id="btn-dismiss-focus"
            onClick={() => {
              setSelectedEntityId(null);
              onClearFocus();
            }}
            className="p-1 px-2 bg-cyan-950 border border-cyan-500/20 hover:border-cyan-500/40 rounded text-[10px] text-cyan-300 font-bold uppercase transition"
          >
            Dismiss Focus
          </button>
        </div>
      )}

      {/* Main Track Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="live-map-grid-wrapper">
        
        {/* SIDEBAR DIRECTORY CONTAINER */}
        <div className="lg:col-span-4 flex flex-col gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 h-[580px] overflow-hidden" id="map-directory-sidebar">
          
          {/* Internal search filter */}
          <div className="space-y-3 shrink-0">
            <h3 className="text-sm font-bold text-slate-300 flex items-center justify-between">
              <span>City Directory list</span>
              <span className="text-[10px] font-mono bg-slate-950 p-1 px-2 text-slate-500 rounded border border-slate-850">
                {hubEntities.length} Total Registered Nodes
              </span>
            </h3>
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search className="h-4 w-4" />
              </span>
              <input
                id="search-map-sidebar-input"
                type="text"
                placeholder="Search name, phone, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>

            {/* Type Toggles */}
            <div className="grid grid-cols-3 gap-1.5" id="type-filter-group-map">
              {(['All', 'Technician', 'Customer'] as const).map(type => (
                <button
                  id={`map-type-filter-${type}`}
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold tracking-tight cursor-pointer transition-colors ${
                    filterType === type 
                      ? 'bg-slate-850 text-cyan-400 border border-cyan-500/20 shadow-sm' 
                      : 'bg-slate-950 text-slate-500 border border-transparent hover:bg-slate-850/50'
                  }`}
                >
                  {type === 'Technician' ? 'Mistris' : type === 'Customer' ? 'Customers' : 'Show All'}
                </button>
              ))}
            </div>
          </div>

          {/* Scrolling List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1" id="geolisted-nodes-scroll">
            {filteredEntities.map(node => {
              const isSelected = selectedEntityId === node.id;
              const hasActiveBooking = node.type === 'Technician' && activeBookings.some(b => b.technicianId === node.id);
              
              return (
                <div
                  id={`geolisted-node-item-${node.id}`}
                  key={node.id}
                  onClick={() => setSelectedEntityId(node.id)}
                  className={`p-3 rounded-xl border transition-all text-xs cursor-pointer flex items-center justify-between group ${
                    isSelected 
                      ? 'bg-slate-800 border-cyan-500' 
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-800 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate max-w-[85%]">
                    <img 
                      src={node.avatar} 
                      alt={node.name} 
                      className="h-8 w-8 rounded-full border border-slate-800 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <p className={`font-bold transition-colors ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                          {node.name}
                        </p>
                        {hasActiveBooking && (
                          <span className="p-0.5 px-1.5 bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 rounded text-[8px] uppercase tracking-wider font-extrabold font-mono animate-pulse">
                            On Dispatch
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 font-mono truncate">
                        {node.type === 'Technician' ? (
                          <span className="text-cyan-400/80 font-semibold">{node.category}</span>
                        ) : (
                          <span className="text-slate-400/80">Customer ID</span>
                        )}
                        • {node.id}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {node.type === 'Technician' ? (
                      <Wrench className="h-3.5 w-3.5 text-cyan-400/60" />
                    ) : (
                      <Users className="h-3.5 w-3.5 text-slate-500/60" />
                    )}
                  </div>
                </div>
              );
            })}

            {filteredEntities.length === 0 && (
              <div className="py-12 text-center text-slate-600 font-mono text-xs" id="empty-map-sidebar">
                No active geonodes match your filter selection.
              </div>
            )}
          </div>

          {/* Quick Stats Summary Footer */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850/60 shrink-0 text-[10px] space-y-1.5 text-slate-500" id="map-quickstats">
            <div className="flex justify-between">
              <span>Live Dispatches (Dhaka/MUM):</span>
              <span className="text-cyan-400 font-bold font-mono">{bookings.filter(b => b.status === 'Live').length} units</span>
            </div>
            <div className="flex justify-between">
              <span>GPS Satellites Connected:</span>
              <span className="text-emerald-400 font-bold font-mono">14 Active</span>
            </div>
            <div className="flex justify-between">
              <span>Precision Target Deviation:</span>
              <span className="font-mono">+/- 2 Meters</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE GEOGRAPHIC DIGITAL RADAR/MAP CONTAINER */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-[580px] relative shadow-lg" id="map-radar-stage">
          
          {/* Map Layer Toolbar */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-2 px-3 rounded-xl z-20 text-[10px] flex items-center gap-2 font-mono text-slate-400" id="map-toolbar">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-bold text-slate-300">{selectedHub} Hub Geostage Rendering</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Vector Grid Activated</span>
            </span>
          </div>

          {/* Map Landmark Overlay panel right top */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-20" id="map-hud-legend">
            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl text-[9px] font-mono space-y-1.5 text-slate-400 shadow-xl max-w-[170px]" id="hud-legend-box">
              <p className="font-sans font-bold text-[10px] text-slate-200 border-b border-slate-850 pb-1 mb-1.5 flex items-center gap-1">
                <Map className="h-3 w-3 text-cyan-400" /> Map Pin Legends
              </p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block" />
                <span>Technician (মিস্ত্রি)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400 inline-block" />
                <span>Customer (কাস্টমার)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="border-t border-dashed border-cyan-400 w-4 inline-block" />
                <span>Active Route Dispatch</span>
              </div>
            </div>
          </div>

          {/* VISUAL SVG DIGITAL VECTOR STAGE */}
          <div className="flex-1 relative bg-slate-950/95 overflow-hidden flex items-center justify-center p-4 border-b border-slate-800" id="vector-stage-body">
            
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-slate-900 pointer-events-none opacity-20" />
            
            {/* Electronic grid layout */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none text-[8px] font-mono text-slate-800">
              <div className="flex justify-between">
                <span>COORD SCALE TRACE: SECURE SHA256 FEED</span>
                <span>NODE LAT_LNG OFFSET: ENCRYPTED</span>
              </div>
              <div className="flex justify-between">
                <span>BEARING RANGE: {selectedHub === 'Dhaka' ? '23.8° N / 90.4° E' : 'AZIMUTH AUTO'}</span>
                <span>GRID FREQ INDEX: 140.23 MHZ</span>
              </div>
            </div>

            {/* Simulated Vector Roadmap Canvas Container */}
            <div className="w-full h-full max-w-[620px] max-h-[460px] relative border border-slate-850/40 rounded-xl" id="cyber-grid-canvas">
              <svg className="w-full h-full absolute inset-0 pointer-events-none text-slate-800/20" viewBox="0 0 100 100" preserveAspectRatio="none">
                
                {/* Radial radar pulses */}
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.1" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.1" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 2" />
                
                {/* Simulated Street Grid Line Layout overlays */}
                <path d="M 0,20 Q 50,45 100,20" fill="none" stroke="currentColor" strokeWidth="0.15" />
                <path d="M 0,55 L 100,55" fill="none" stroke="currentColor" strokeWidth="0.15" strokeDasharray="2 1" />
                <path d="M 0,85 C 30,75 70,95 100,85" fill="none" stroke="currentColor" strokeWidth="0.15" />
                
                <path d="M 15,0 Q 40,50 15,100" fill="none" stroke="currentColor" strokeWidth="0.15" />
                <path d="M 50,0 Q 45,50 50,100" fill="none" stroke="currentColor" strokeWidth="0.2" />
                <path d="M 80,0 L 80,100" fill="none" stroke="currentColor" strokeWidth="0.15" />

                {/* Draw City River or Central Lake path for Dhaka */}
                {selectedHub === 'Dhaka' && (
                  <path d="M 5,5 Q 45,35 48,100" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="10" />
                )}
                {selectedHub === 'Mumbai' && (
                  <path d="M 10,0 C 15,40 5,60 30,100" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="8" />
                )}

                {/* Active Routing Paths connecting active dispatches on map */}
                {activeBookings.map(b => {
                  const techGeo = GEOLOCATIONS[b.technicianId];
                  const customerGeo = GEOLOCATIONS[b.customerId];
                  
                  if (techGeo && customerGeo) {
                    // Start is technician coordinates while considering live translation simulation
                    const techNode = hubEntities.find(n => n.id === b.technicianId);
                    const flowCoord = techNode ? getCoordinates(techNode) : { x: techGeo.x, y: techGeo.y };
                    
                    return (
                      <g key={`booking-route-${b.id}`} className="transition-all">
                        {/* Static dotted full line route */}
                        <path 
                          d={`M ${techGeo.x},${techGeo.y} L ${customerGeo.x},${customerGeo.y}`}
                          fill="none" 
                          stroke="rgba(6, 182, 212, 0.25)" 
                          strokeWidth="0.4" 
                          strokeDasharray="1 1" 
                        />
                        {/* Dynamic scrolling flow line route starting from slider center */}
                        <circle cx={flowCoord.x} cy={flowCoord.y} r="0.6" fill="#22d3ee" className="animate-ping" />
                        <line 
                          x1={flowCoord.x} 
                          y1={flowCoord.y} 
                          x2={customerGeo.x} 
                          y2={customerGeo.y} 
                          stroke="#22d3ee" 
                          strokeWidth="0.3" 
                        />
                      </g>
                    );
                  }
                  return null;
                })}
              </svg>

              {/* Central city landmarks label indicators */}
              {CITY_LANDMARKS[selectedHub]?.map((lm, idx) => (
                <div 
                  key={`lm-${idx}`}
                  style={{ left: `${lm.x}%`, top: `${lm.y}%` }}
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 select-none"
                >
                  <p className="text-[7.5px] font-sans font-medium text-slate-700/80 tracking-tight uppercase whitespace-nowrap bg-slate-950/20 px-1 rounded">
                    {lm.name}
                  </p>
                </div>
              ))}

              {/* Render Interactive Pin Nodes */}
              {hubEntities.map((node) => {
                const isSelected = selectedEntityId === node.id;
                const coords = getCoordinates(node);
                const isTech = node.type === 'Technician';
                const hasActiveBooking = isTech && activeBookings.some(b => b.technicianId === node.id);

                return (
                  <motion.div
                    key={`pin-${node.id}`}
                    style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                    onClick={() => setSelectedEntityId(node.id)}
                    whileHover={{ scale: 1.2 }}
                    layoutTransition={{ duration: 0.1 }}
                  >
                    {/* Glowing outer halo for selections */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.4, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className={`absolute inset-0 -m-3 rounded-full border ${
                            isTech ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-purple-500/40 bg-purple-500/5'
                          } animate-ping`}
                        />
                      )}
                    </AnimatePresence>

                    {/* Simple pulsing aura for live dispatches */}
                    {hasActiveBooking && !isSelected && (
                      <div className="absolute inset-0 -m-2 rounded-full border border-cyan-400 bg-cyan-400/5 animate-pulse" />
                    )}

                    {/* Actual Pin Marker Head */}
                    <div className={`p-1.5 rounded-lg border flex items-center justify-center relative shadow-md transition-all ${
                      isSelected 
                        ? isTech 
                          ? 'bg-cyan-500 border-white text-slate-950 scale-110 z-20' 
                          : 'bg-purple-500 border-white text-white scale-110 z-20'
                        : isTech 
                          ? 'bg-slate-900 border-cyan-500 text-cyan-400' 
                          : 'bg-slate-900 border-purple-500 text-purple-400'
                    }`}>
                      {isTech ? (
                        <Wrench className="h-3 w-3 shrink-0" />
                      ) : (
                        <Users className="h-3 w-3 shrink-0" />
                      )}

                      {/* Small text indicator above head */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1 py-0.5 bg-slate-950/80 backdrop-blur border border-slate-800 text-[6.5px] font-sans font-bold text-slate-300 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {node.name}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* QUICK NODE CONTROLLER DRAWER */}
          <div className="h-24 bg-slate-950 border-t border-slate-850 p-4 px-6 flex items-center justify-between shrink-0" id="map-drawer-footer">
            <AnimatePresence mode="wait">
              {selectedEntity ? (
                <motion.div 
                  key={selectedEntity.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  id={`drawer-node-info-${selectedEntity.id}`}
                >
                  <div className="flex items-center gap-3.5 max-w-[70%]">
                    <img 
                      src={selectedEntity.avatar} 
                      alt={selectedEntity.name} 
                      className={`h-11 w-11 rounded-full object-cover border-2 ${
                        selectedEntity.type === 'Technician' ? 'border-cyan-500/80' : 'border-purple-500/80'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{selectedEntity.name}</h4>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-tight uppercase ${
                          selectedEntity.type === 'Technician' 
                            ? 'bg-cyan-500/15 text-cyan-400' 
                            : 'bg-purple-500/15 text-purple-400'
                        }`}>
                          {selectedEntity.type === 'Technician' ? 'Mistri (মিস্ত্রি)' : 'Customer (কাস্টমার)'}
                        </span>
                        
                        {/* Simulation feedback indicators */}
                        {isSimulating && selectedEntity.type === 'Technician' && activeBookings.some(b => b.technicianId === selectedEntity.id) && (
                          <span className="flex items-center gap-1 text-[9px] text-cyan-400 font-bold font-mono animate-pulse">
                            <Navigation className="h-2.5 w-2.5 animate-spin" /> Moving to dispatch node...
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        {selectedEntity.address}
                        <span className="text-[10px] text-slate-600 font-mono">
                          ({selectedEntity.lat.toFixed(4)}°, {selectedEntity.lng.toFixed(4)}°)
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar for chosen Entity */}
                  <div className="flex items-center gap-2" id="drawer-node-actions">
                    <a
                      href={`tel:${selectedEntity.phone}`}
                      className="p-2 bg-slate-905 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 flex items-center gap-1.5 transition-colors text-[10px] font-bold cursor-pointer"
                    >
                      <Phone className="h-3.5 w-3.5 text-cyan-400" /> 
                      <span>{selectedEntity.phone}</span>
                    </a>
                    
                    {selectedEntity.type === 'Technician' ? (
                      <div className="p-2 py-1 px-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[10px] text-slate-400">
                        Category: <strong className="text-cyan-400 font-bold">{selectedEntity.category}</strong>
                      </div>
                    ) : (
                      <div className="p-2 py-1 px-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[10px] text-slate-400">
                        Status: <strong className="text-purple-400 font-bold">{selectedEntity.status}</strong>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="map-unselected-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full text-center text-slate-500 text-xs font-mono py-1 select-none flex items-center justify-center gap-2"
                  id="map-drawer-placeholder"
                >
                  <MapPin className="h-4 w-4 text-cyan-405/40 animate-bounce" />
                  ম্যাপ থেকে কাস্টমার বা মিস্ত্রি সিলেক্ট করুন বিশদ বিবরণ এবং ইনস্ট্যান্ট ট্র্যাকিং দেখতে
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}

import { useState, useMemo } from 'react';
import { Contact, parseRows } from '../lib/parseRows';
import { Search, Loader2, Phone, Briefcase, User as UserIcon, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ContactsDirectoryProps {
  dataRows: any[][];
  isLoading: boolean;
}

export function ContactsDirectory({ dataRows, isLoading }: ContactsDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const contacts = useMemo(() => parseRows(dataRows), [dataRows]);

  const filteredContacts = useMemo(() => {
    if (!searchTerm) return contacts;
    const lowerSearch = searchTerm.toLowerCase();
    
    // Search the raw row for ANY column match
    return contacts.filter(c => {
      const rowStrings = c.rawRow.map(String).join(' ').toLowerCase();
      return rowStrings.includes(lowerSearch);
    });
  }, [contacts, searchTerm]);

  const groupedContacts = useMemo(() => {
    const groups: Record<string, Contact[]> = {};
    filteredContacts.forEach(contact => {
      const cat = contact.category || 'Uncategorized';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(contact);
    });
    return groups;
  }, [filteredContacts]);

  const groupKeys = Object.keys(groupedContacts).sort();

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-full overflow-hidden">
      <header className="flex-none pt-8 pb-6 px-6 sm:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <img src="/logo.png" alt="Contacts Directory by AB Logo" className="h-14 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 hidden">Contacts Directory</h1>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-950 focus:ring-0 rounded-xl transition-all outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto px-6 sm:px-8 py-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          </div>
        ) : groupKeys.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">No contacts found.</p>
          </div>
        ) : (
          <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/20 rounded-xl shadow-sm overflow-hidden mb-8 divide-y divide-zinc-300 dark:divide-white/20">
            {groupKeys.map(category => (
              <React.Fragment key={category}>
                {groupedContacts[category].map((contact: Contact, idx: number) => (
                   <ContactCard key={`${category}-${idx}`} contact={contact} />
                ))}
              </React.Fragment>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import React, { type ReactElement } from 'react';

const ContactCard: React.FC<{ contact: Contact }> = ({ contact }) => {
  const displayTitle = contact.name ? contact.name : contact.businessName || 'Unnamed';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col px-4 py-3 bg-white dark:bg-zinc-900 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
    >
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 line-clamp-1">
             {displayTitle} <span className="font-normal text-zinc-400 dark:text-zinc-500 mx-1">-</span> <span className="font-medium text-zinc-600 dark:text-zinc-300">{contact.typeOfService}</span>
          </h3>
        </div>
      </div>
      
      <div className="mt-auto flex flex-col gap-1.5">
        {contact.name && contact.businessName ? (
           <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
             <Briefcase className="w-3.5 h-3.5 mr-2 text-zinc-400 dark:text-zinc-500 shrink-0" />
             <span className="line-clamp-1">{contact.businessName}</span>
           </div>
        ) : null}
        
        {contact.phoneNumber && (
           <div className="flex items-center text-xs font-medium">
             <Phone className="w-3.5 h-3.5 mr-2 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
             <a 
               href={`tel:${contact.phoneNumber}`} 
               className="text-blue-800 dark:text-[#39FF14] hover:underline transition-colors dark:drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]"
             >
               {contact.phoneNumber}
             </a>
           </div>
        )}
      </div>
    </motion.div>
  );
}

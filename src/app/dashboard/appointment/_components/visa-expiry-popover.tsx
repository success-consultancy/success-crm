'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { Mail, MessageSquare, X } from 'lucide-react';
import Button from '@/components/atoms/button';
import { VisaExpiryEvent, getCategoryColor } from './use-visa-expiries';

interface VisaExpiryPopoverProps {
  event: VisaExpiryEvent;
  onClose: () => void;
  onSendEmail?: (event: VisaExpiryEvent) => void;
  onSendSms?: (event: VisaExpiryEvent) => void;
}

const VisaExpiryPopover: React.FC<VisaExpiryPopoverProps> = ({
  event,
  onClose,
  onSendEmail,
  onSendSms,
}) => {
  const color = getCategoryColor(event.category);

  let expiryDate = event.visaExpiry;
  try {
    expiryDate = format(parseISO(event.visaExpiry), 'd MMM, yyyy');
  } catch {
    // keep raw value if parsing fails
  }

  const handleEmail = () => {
    if (onSendEmail) onSendEmail(event);
    else window.location.href = `mailto:${event.email}`;
  };

  const handleSms = () => {
    if (onSendSms) onSendSms(event);
    else window.location.href = `sms:${event.phone}`;
  };

  return (
    <div className="min-w-[360px]">
      <div className="flex items-start justify-between gap-3 pb-3 border-b">
        <div className="flex items-start gap-2 min-w-0">
          <span
            className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <h4 className="text-b14-600 text-neutral-black truncate">
            {event.firstName}'s Visa Expires ({event.category})
          </h4>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={handleEmail} title="Send email">
            <Mail className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSms} title="Send SMS">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} title="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="pt-3 flex flex-col gap-2">
        <div className="flex">
          <span className="text-b13-500 text-neutral-black w-[100px] flex-shrink-0">Service:</span>
          <span className="text-b13 text-neutral-dark-grey">{event.service}</span>
        </div>
        <div className="flex">
          <span className="text-b13-500 text-neutral-black w-[100px] flex-shrink-0">Expiry date:</span>
          <span className="text-b13 text-neutral-dark-grey">{expiryDate}</span>
        </div>
        <div className="flex">
          <span className="text-b13-500 text-neutral-black w-[100px] flex-shrink-0">Email:</span>
          <span className="text-b13 text-neutral-dark-grey">{event.email}</span>
        </div>
        <div className="flex">
          <span className="text-b13-500 text-neutral-black w-[100px] flex-shrink-0">Phone:</span>
          <span className="text-b13 text-neutral-dark-grey">{event.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default VisaExpiryPopover;

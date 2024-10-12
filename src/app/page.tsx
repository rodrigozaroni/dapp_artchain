"use client";
import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, LogOut, QrCode, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';

// Interface for Event
interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  imageUrl: string;
}

// Interface for EventCardProps
interface EventCardProps extends Event {
  isUserEvent?: boolean;
}

// EventCard component definition
const EventCard = ({
  title,
  date,
  location,
  category,
  imageUrl,
  isUserEvent,
}: EventCardProps) => (
  <div
    className={`bg-white rounded-lg shadow-md overflow-hidden ${
      isUserEvent ? 'border-2 border-blue-500' : ''
    }`}
  >
    <Image
      src={imageUrl}
      alt={title}
      width={400}
      height={192}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="flex items-center text-gray-600 mb-2">
        <Calendar className="w-4 h-4 mr-2" />
        <span>{date}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <MapPin className="w-4 h-4 mr-2" />
        <span>{location}</span>
      </div>
      <div className="text-sm text-blue-600">{category}</div>
      {isUserEvent && (
        <div className="mt-2">
          <Button className="w-full">
            <QrCode className="w-4 h-4 mr-2" />
            Show QR Code
          </Button>
        </div>
      )}
    </div>
  </div>
);

// Interface for QRCodeScannerProps
interface QRCodeScannerProps {
  onScan: (qrCode: string) => void;
}

// QRCodeScanner component definition
const QRCodeScanner = ({ onScan }: QRCodeScannerProps) => {
  const [qrCode, setQrCode] = useState<string>('');

  const handleScan = () => {
    onScan(qrCode);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Input
        type="text"
        placeholder="Enter QR Code"
        value={qrCode}
        onChange={(e) => setQrCode(e.target.value)}
      />
      <Button onClick={handleScan}>Scan QR Code</Button>
    </div>
  );
};

// Interface for AttendanceCertificateProps
interface AttendanceCertificateProps {
  eventTitle: string;
  attendeeName: string;
  date: string;
}

// AttendanceCertificate component definition
const AttendanceCertificate = ({
  eventTitle,
  attendeeName,
  date,
}: AttendanceCertificateProps) => (
  <div className="bg-white p-8 rounded-lg shadow-lg text-center">
    <h2 className="text-3xl font-bold mb-4">Certificado de Participação</h2>
    <p className="text-xl mb-4">Certificamos que o Aluno(a) </p>
    <p className="text-2xl font-semibold mb-4">{attendeeName}</p>
    <p className="text-xl mb-4">participou do</p>
    <p className="text-2xl font-semibold mb-4">{eventTitle}</p>
    <p className="text-xl mb-4">Contando como 4 horas de HH</p>
    <p className="text-2xl font-semibold mb-8">{date}</p>
    <div className="border-t-2 border-gray-300 pt-4">
      <p className="text-lg font-semibold">ArtChain</p>
    </div>
  </div>
);

const ArtChainFrontend = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [certificateData, setCertificateData] = useState<AttendanceCertificateProps | null>(null);

  const itemsPerPage = 6;

  const currentDate = new Date();
  const nextWeek = new Date(
    currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
  );

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const mockUserEvents: Event[] = [
    {
      id: 101,
      title: "ArtChain Pitch",
      date: formatDate(currentDate),
      location: "Online",
      category: "Competição",
      imageUrl:
        "https://ifpr.edu.br/irati/wp-content/uploads/sites/14/2024/04/concurso-de-artes-visuais-do-ifpr-irati.jpg",
    },
    {
      id: 102,
      title: "ArtChain Workshop",
      date: formatDate(nextWeek),
      location: "Online",
      category: "Competição",
      imageUrl:
        "https://ifpr.edu.br/irati/wp-content/uploads/sites/14/2024/04/concurso-de-artes-visuais-do-ifpr-irati.jpg",
    },
  ];

  const dummyEvents: Event[] = [
    {
      id: 1,
      title: "Exposição de NFTArt",
      date: formatDate(currentDate),
      location: "Rio de Janeiro",
      category: "Arte",
      imageUrl: "https://www.infura.io/_next/image?...",
    },
    // ... other events
  ];

  const filteredEvents = dummyEvents.filter((event: Event) => {
    return (
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (dateFilter ? event.date === dateFilter : true) &&
      (categoryFilter ? event.category === categoryFilter : true) &&
      (locationFilter ? event.location === locationFilter : true)
    );
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Edite esta parte do código para mudar para login via Metamask

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === 'artchain' && password === 'artchain') {
      setIsLoggedIn(true);
      setUserEvents(mockUserEvents);
    } else {
      alert('Usuário Inválido');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setUserEvents([]);
  };

  const handleQRScan = (qrCode: string) => {
    const event = [...userEvents, ...dummyEvents].find(
      (e: Event) => e.id.toString() === qrCode
    );
    if (event) {
      setCertificateData({
        eventTitle: event.title,
        attendeeName: username,
        date: event.date,
      });
      setShowCertificate(true);
    } else {
      alert('QR Code Inválido');
    }
    setShowQRScanner(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, categoryFilter, locationFilter]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ... your JSX code */}
    </div>
  );
};

export default ArtChainFrontend;

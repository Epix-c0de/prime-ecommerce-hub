import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Bot
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ticket {
  id: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: Date;
  lastReply: Date;
  messages: {
    id: string;
    sender: 'customer' | 'agent' | 'bot';
    message: string;
    timestamp: Date;
  }[];
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT001',
    subject: 'Order not delivered',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'open',
    priority: 'high',
    category: 'Shipping',
    createdAt: new Date('2024-01-12'),
    lastReply: new Date('2024-01-12'),
    messages: [
      { id: '1', sender: 'customer', message: 'My order was supposed to arrive 3 days ago but I haven\'t received it yet. Order #ORD-2024-001', timestamp: new Date('2024-01-12T10:00:00') },
      { id: '2', sender: 'bot', message: 'Thank you for contacting us. I can see your order #ORD-2024-001 is currently in transit. An agent will follow up with more details.', timestamp: new Date('2024-01-12T10:01:00') },
    ]
  },
  {
    id: 'TKT002',
    subject: 'Refund inquiry',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    status: 'in_progress',
    priority: 'medium',
    category: 'Returns',
    createdAt: new Date('2024-01-11'),
    lastReply: new Date('2024-01-12'),
    messages: [
      { id: '1', sender: 'customer', message: 'When will I receive my refund? I returned the item last week.', timestamp: new Date('2024-01-11T14:00:00') },
      { id: '2', sender: 'agent', message: 'Hi Jane, I\'ve checked your return and it was received yesterday. The refund will be processed within 3-5 business days.', timestamp: new Date('2024-01-12T09:00:00') },
    ]
  },
  {
    id: 'TKT003',
    subject: 'Product question',
    customerName: 'Bob Wilson',
    customerEmail: 'bob@example.com',
    status: 'resolved',
    priority: 'low',
    category: 'Product',
    createdAt: new Date('2024-01-10'),
    lastReply: new Date('2024-01-10'),
    messages: [
      { id: '1', sender: 'customer', message: 'Does the wireless headphone come with a charging cable?', timestamp: new Date('2024-01-10T11:00:00') },
      { id: '2', sender: 'agent', message: 'Yes, the headphones include a USB-C charging cable and a carrying pouch.', timestamp: new Date('2024-01-10T11:30:00') },
      { id: '3', sender: 'customer', message: 'Perfect, thank you!', timestamp: new Date('2024-01-10T11:45:00') },
    ]
  },
];

export function SupportTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  const sendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    const newMessage = {
      id: String(Date.now()),
      sender: 'agent' as const,
      message: replyMessage,
      timestamp: new Date(),
    };

    setTickets(tickets.map(t => 
      t.id === selectedTicket.id 
        ? { ...t, messages: [...t.messages, newMessage], lastReply: new Date(), status: 'in_progress' as const }
        : t
    ));
    setSelectedTicket(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
    setReplyMessage('');
    toast({ title: 'Reply Sent', description: 'Your response has been sent to the customer.' });
  };

  const updateStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status } : t));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status } : null);
    }
    toast({ title: 'Status Updated', description: `Ticket marked as ${status.replace('_', ' ')}.` });
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      case 'closed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Support Tickets</h2>
        <p className="text-muted-foreground">
          Manage customer support requests and communications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Tickets
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="space-y-2 p-4">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedTicket?.id === ticket.id
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-sm line-clamp-1">{ticket.subject}</span>
                        <Badge variant={getPriorityColor(ticket.priority)} className="text-xs">
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{ticket.customerName}</span>
                        <Badge variant={getStatusColor(ticket.status)} className="text-xs">
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            {selectedTicket ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedTicket.subject}</CardTitle>
                      <CardDescription>
                        {selectedTicket.customerName} • {selectedTicket.customerEmail}
                      </CardDescription>
                    </div>
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(v: Ticket['status']) => updateStatus(selectedTicket.id, v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {selectedTicket.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${
                            msg.sender === 'customer' ? '' : 'flex-row-reverse'
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {msg.sender === 'customer' ? <User className="h-4 w-4" /> :
                               msg.sender === 'bot' ? <Bot className="h-4 w-4" /> :
                               'AG'}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.sender === 'customer'
                                ? 'bg-muted'
                                : msg.sender === 'bot'
                                ? 'bg-blue-100 dark:bg-blue-900/30'
                                : 'bg-primary text-primary-foreground'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                    <Button onClick={sendReply} disabled={!replyMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a ticket to view details</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

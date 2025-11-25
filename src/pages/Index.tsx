import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import Map from '@/components/Map';

interface Event {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
  isFavorite: boolean;
  lat: number;
  lng: number;
}

const categories = [
  { name: 'Все', icon: 'Grid3x3' },
  { name: 'События', icon: 'Calendar' },
  { name: 'Заведения', icon: 'Store' },
  { name: 'Культура', icon: 'Theater' },
  { name: 'Развлечения', icon: 'Gamepad2' },
  { name: 'Афиша', icon: 'Film' },
  { name: 'Маршруты', icon: 'Map' },
  { name: 'Избранное', icon: 'Heart' },
];

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Концерт на набережной',
    category: 'События',
    date: '15 декабря',
    time: '19:00',
    location: 'Набережная Амура',
    price: 'Бесплатно',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    isFavorite: false,
    lat: 48.4803,
    lng: 135.0790,
  },
  {
    id: 2,
    title: 'Выставка современного искусства',
    category: 'Культура',
    date: '18 декабря',
    time: '10:00',
    location: 'Музей им. Гродекова',
    price: '300 ₽',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    isFavorite: false,
    lat: 48.4799,
    lng: 135.0586,
  },
  {
    id: 3,
    title: 'Спектакль "Евгений Онегин"',
    category: 'Культура',
    date: '20 декабря',
    time: '18:30',
    location: 'Театр драмы',
    price: '800 ₽',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    isFavorite: false,
    lat: 48.4827,
    lng: 135.0700,
  },
  {
    id: 4,
    title: 'Кафе "Амурский берег"',
    category: 'Заведения',
    date: 'Ежедневно',
    time: '09:00 - 23:00',
    location: 'ул. Муравьёва-Амурского, 15',
    price: '500-1500 ₽',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    isFavorite: false,
    lat: 48.4836,
    lng: 135.0596,
  },
  {
    id: 5,
    title: 'Зимний фестиваль',
    category: 'Развлечения',
    date: '25 декабря',
    time: '12:00',
    location: 'Центральный парк',
    price: 'Бесплатно',
    image: 'https://images.unsplash.com/photo-1482575832494-771f74bf6857?w=800',
    isFavorite: false,
    lat: 48.4850,
    lng: 135.0750,
  },
  {
    id: 6,
    title: 'Кинопоказ "Рождество"',
    category: 'Афиша',
    date: '23 декабря',
    time: '20:00',
    location: 'Кинотеатр "Совкино"',
    price: '400 ₽',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    isFavorite: false,
    lat: 48.4795,
    lng: 135.0650,
  },
  {
    id: 7,
    title: 'Исторический маршрут по центру',
    category: 'Маршруты',
    date: 'Доступен всегда',
    time: '2-3 часа',
    location: 'Старт: площадь Ленина',
    price: 'Бесплатно',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    isFavorite: false,
    lat: 48.4835,
    lng: 135.0838,
  },
  {
    id: 8,
    title: 'Музей истории Хабаровска',
    category: 'Культура',
    date: 'Вт-Вс',
    time: '10:00 - 18:00',
    location: 'ул. Шевчено, 7',
    price: '200 ₽',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800',
    isFavorite: false,
    lat: 48.4807,
    lng: 135.0720,
  },
];

const API_URL = 'https://functions.poehali.dev/349454e6-748c-47a0-a46a-9acfee46d950';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchEvents();
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, [selectedCategory, searchQuery]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let url = API_URL;
      const params = new URLSearchParams();
      
      if (selectedCategory && selectedCategory !== 'Все' && selectedCategory !== 'Избранное') {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Ошибка загрузки событий:', error);
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = selectedCategory === 'Избранное'
    ? events.filter(event => favorites.has(event.id))
    : events;

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2.5 rounded-xl shadow-lg">
                <Icon name="MapPin" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Хабаровск</h1>
                <p className="text-sm text-muted-foreground">Карта событий и мест</p>
              </div>
            </div>
            <Button size="lg" className="shadow-md" onClick={() => setIsMapOpen(true)}>
              <Icon name="MapPin" size={20} className="mr-2" />
              Карта
            </Button>
          </div>
          
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск событий, заведений, мест..."
              className="pl-11 h-12 text-base shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <nav className="sticky top-[125px] z-40 bg-background/95 backdrop-blur-sm border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                size="sm"
                className={`flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.name 
                    ? 'shadow-md scale-105' 
                    : 'hover:scale-105'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <Icon name={category.icon as any} size={16} />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Найдено: <span className="font-semibold text-foreground">{filteredEvents.length}</span>
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event, index) => (
            <Card
              key={event.id}
              className="overflow-hidden group hover:shadow-2xl transition-all duration-500 animate-fade-in border-border/50 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 right-3 shadow-lg hover:scale-110 transition-transform duration-200"
                  onClick={() => toggleFavorite(event.id)}
                >
                  <Icon 
                    name="Heart" 
                    size={18} 
                    className={favorites.has(event.id) ? 'fill-red-500 text-red-500' : ''}
                  />
                </Button>
                
                <Badge className="absolute bottom-3 left-3 shadow-md backdrop-blur-sm bg-background/90">
                  {event.category}
                </Badge>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" size={16} className="text-primary" />
                    <span>{event.date}</span>
                    <span className="text-xs">•</span>
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={16} className="text-primary" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Icon name="Wallet" size={16} className="text-primary" />
                    <span className="font-semibold text-foreground">{event.price}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 shadow-md" 
                  size="sm"
                  onClick={() => {
                    setSelectedEventId(event.id);
                    setIsMapOpen(true);
                  }}
                >
                  Показать на карте
                  <Icon name="MapPin" size={16} className="ml-2" />
                </Button>
              </div>
            </Card>
          ))}
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
              <Icon name="Search" size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить фильтры или поисковый запрос
            </p>
          </div>
        )}
      </main>

      <footer className="bg-card border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Icon name="MapPin" size={20} />
                </div>
                <h3 className="font-bold text-lg">Хабаровск</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Актуальная информация о событиях, заведениях и интересных местах города
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Категории</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>События и концерты</li>
                <li>Кафе и рестораны</li>
                <li>Музеи и театры</li>
                <li>Парки и аллеи</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>info@khabarovsk-map.ru</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  <span>+7 (4212) 123-456</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>© 2024 Карта Хабаровска. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <Sheet open={isMapOpen} onOpenChange={setIsMapOpen}>
        <SheetContent side="right" className="w-full sm:max-w-3xl p-0">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="flex items-center gap-2">
              <Icon name="Map" size={24} className="text-primary" />
              Карта Хабаровска
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-100px)] p-6 pt-0">
            <Map 
              events={filteredEvents} 
              onEventClick={(id) => setSelectedEventId(id)}
              selectedEventId={selectedEventId}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
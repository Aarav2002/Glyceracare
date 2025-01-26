import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data } = await supabase
        .from('contact_info')
        .select('*')
        .single();

      if (data) {
        setContactInfo(data);
      }
      setLoading(false);
    };

    fetchContactInfo();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <section id="contact" className="py-24 bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-xl">
            We'd love to hear from you
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
          <div className="flex flex-col items-start space-y-8">
            <div className="flex flex-col items-start">
              <Mail className="h-6 w-6 text-teal-600" />
              <h3 className="mt-4 text-lg font-medium">Email</h3>
              <p className="mt-2">{contactInfo.email}</p>
            </div>
            <div className="flex flex-col items-start">
              <Phone className="h-6 w-6 text-teal-600" />
              <h3 className="mt-4 text-lg font-medium">Phone</h3>
              <p className="mt-2">{contactInfo.phone}</p>
            </div>
            <div className="flex flex-col items-start">
              <MapPin className="h-6 w-6 text-teal-600" />
              <h3 className="mt-4 text-lg font-medium">Address</h3>
              <p className="mt-2">{contactInfo.address}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

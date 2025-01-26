import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface Contact {
  id: string;
  email: string;
  phone: string;
  address: string;
}

export function ContactManager() {
  const { user } = useAuth();
  const [contactInfo, setContactInfo] = useState({ id: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_info')
      .select('*');

    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('contact_info')
          .update({
            email: contactInfo.email,
            phone: contactInfo.phone,
            address: contactInfo.address,
          })
          .eq('id', contactInfo.id);

        if (error) {
          console.error('Error updating contact info:', error);
        }
      } else {
        const { error } = await supabase
          .from('contact_info')
          .insert([{
            email: contactInfo.email,
            phone: contactInfo.phone,
            address: contactInfo.address,
          }]);

        if (error) {
          console.error('Error creating contact info:', error);
        }
      }
      fetchContacts();
      setIsEditing(false);
      setContactInfo({ id: '', email: '', phone: '', address: '' });
    } catch (error) {
      console.error('Error saving contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setContactInfo(contact);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_info')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting contact info:', error);
      } else {
        fetchContacts();
      }
    } catch (error) {
      console.error('Error deleting contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Contact Information</h2>
      <div>
        <input
          type="text"
          name="email"
          value={contactInfo.email}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          placeholder="Email"
        />
        <input
          type="text"
          name="phone"
          value={contactInfo.phone}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          placeholder="Phone"
        />
        <input
          type="text"
          name="address"
          value={contactInfo.address}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          placeholder="Address"
        />
        <button onClick={handleSave} className="bg-teal-600 text-white px-4 py-2 rounded-md">
          {isEditing ? 'Update' : 'Create'} Contact
        </button>
      </div>

      <h3 className="text-xl font-bold mt-6">Existing Contacts</h3>
      <ul className="mt-4">
        {contacts.map((contact) => (
          <li key={contact.id} className="flex justify-between items-center border-b py-2">
            <div>
              <p>Email: {contact.email}</p>
              <p>Phone: {contact.phone}</p>
              <p>Address: {contact.address}</p>
            </div>
            <div>
              <button onClick={() => handleEdit(contact)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(contact.id)} className="text-red-600 ml-4">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 
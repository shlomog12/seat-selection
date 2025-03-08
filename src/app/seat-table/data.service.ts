import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SelectionModel } from './selection.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private supabase!: SupabaseClient<any, "public", any>;
  private initialized = false;

  constructor() { 
    this.init();
  }

  private async init() {
    const configJson = await this.getConfig();
    this.supabase = createClient(configJson.supabaseUrl, configJson.supabaseKey);
    this.initialized = true;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
    }
  }

  async getAllSelections(): Promise<any[]> {
    await this.ensureInitialized();
    const selections = await this.supabase.from('seatSelectionTable').select('*');
    console.log(selections.data);
    return selections.data ?? [];
  }

  async insertData(body: SelectionModel) {
    await this.ensureInitialized();
    const { data, error } = await this.supabase
        .from('seatSelectionTable')
        .insert([body]);

    if (error) {
        console.error("Error inserting data:", error);
    } else {
        console.log("Inserted data:", data);
    }
  }

  private async getConfig() {
    try {
        const response = await fetch('config.json');
        
        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // Parse the JSON data
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
  }
}

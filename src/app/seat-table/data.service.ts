import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { SelectionModel } from './selection.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  private supabase!: SupabaseClient<any, "public", any>;

  async init(){
    const configJson = await this.getConfig();
    this.supabase = createClient(configJson.supabaseUrl, configJson.supabaseKey)
  }

  async insertData(body :SelectionModel) {
    const { data, error } = await this.supabase
        .from('seatSelectionTable')
        .insert([body]);

    if (error) {
        console.error("Error inserting data:", error);
    } else {
        console.log("Inserted data:", data);
    }
  }

  async getConfig() {
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

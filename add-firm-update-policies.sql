-- Add UPDATE policies for firm members to update forms from their firm

-- Personal Injury Forms
CREATE POLICY "Firm members can update forms from their firm" ON public.personal_injury_forms
    FOR UPDATE USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- Wrongful Death Forms
CREATE POLICY "Firm members can update wrongful death forms from their firm" ON public.wrongful_death_forms
    FOR UPDATE USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- Wrongful Termination Forms
CREATE POLICY "Firm members can update wrongful termination forms from their firm" ON public.wrongful_termination_forms
    FOR UPDATE USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- Also add DELETE policies for firm admins to manage forms in their firm

-- Personal Injury Forms
CREATE POLICY "Firm admins can delete forms from their firm" ON public.personal_injury_forms
    FOR DELETE USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'firm_admin'
        )
    );

-- Wrongful Death Forms
CREATE POLICY "Firm admins can delete wrongful death forms from their firm" ON public.wrongful_death_forms
    FOR DELETE USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'firm_admin'
        )
    );

-- Wrongful Termination Forms
CREATE POLICY "Firm admins can delete wrongful termination forms from their firm" ON public.wrongful_termination_forms
    FOR DELETE USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'firm_admin'
        )
    );
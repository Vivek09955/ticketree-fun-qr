-- Create atomic ticket purchase function to prevent race conditions
CREATE OR REPLACE FUNCTION public.purchase_ticket(
  p_event_id UUID,
  p_user_id UUID
)
RETURNS TABLE(
  ticket_id UUID,
  success BOOLEAN,
  message TEXT,
  qr_code TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ticket_id UUID;
  v_qr_code TEXT;
BEGIN
  -- Atomically check and decrement seats in a single operation
  UPDATE events
  SET available_seats = available_seats - 1
  WHERE id = p_event_id
    AND available_seats > 0
  RETURNING id INTO p_event_id;
  
  -- If no rows were updated, seats were unavailable
  IF p_event_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, 'No seats available'::TEXT, NULL::TEXT;
    RETURN;
  END IF;
  
  -- Generate QR code
  v_qr_code := 'TICKET-' || p_event_id || '-' || p_user_id || '-' || extract(epoch from now())::bigint;
  
  -- Create ticket
  INSERT INTO tickets (event_id, user_id, qr_code_data)
  VALUES (p_event_id, p_user_id, v_qr_code)
  RETURNING id INTO v_ticket_id;
  
  RETURN QUERY SELECT v_ticket_id, TRUE, 'Ticket purchased successfully'::TEXT, v_qr_code;
END;
$$;